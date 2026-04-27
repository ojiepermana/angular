#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const libraryPkgPath = resolve(__dirname, '../package.json');

const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const BUMP_TYPES = ['major', 'minor', 'patch'];

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: repoRoot, ...opts }).trim();
}

function runInherit(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: repoRoot });
}

function fail(message) {
  console.error(`\n\u2717 ${message}\n`);
  process.exit(1);
}

function info(message) {
  console.log(`\u2192 ${message}`);
}

function success(message) {
  console.log(`\u2713 ${message}`);
}

function checkNpmLogin() {
  info('Checking npm authentication...');

  const result = spawnSync('npm', ['whoami', '--registry', 'https://registry.npmjs.org/'], {
    stdio: 'pipe',
    encoding: 'utf8',
    cwd: repoRoot,
  });

  if (result.status !== 0) {
    fail('Not logged in to npm. Run `npm login` before publishing.');
  }

  const username = result.stdout.trim();
  success(`Authenticated to npm as ${username}.`);
}

function bumpVersion(current, type) {
  if (!SEMVER_RE.test(current)) {
    throw new Error(`Current version "${current}" is not a valid semver X.Y.Z.`);
  }
  let [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      throw new Error(`Unknown bump type: ${type}`);
  }
  return `${major}.${minor}.${patch}`;
}

async function checkGitClean() {
  info('Checking git status...');

  try {
    run('git rev-parse --is-inside-work-tree');
  } catch {
    fail('Not a git repository.');
  }

  const status = run('git status --porcelain');
  if (status.length > 0) {
    console.error('\nUncommitted changes detected:\n');
    console.error(status);
    fail('Please commit your changes before publishing.');
  }

  const branch = run('git rev-parse --abbrev-ref HEAD');
  info(`Current branch: ${branch}`);

  try {
    run('git fetch');
  } catch {
    fail('Failed to fetch from remote.');
  }

  let upstream;
  try {
    upstream = run('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
  } catch {
    fail(`Branch "${branch}" has no upstream. Push it first with: git push -u origin ${branch}`);
  }

  const ahead = run(`git rev-list ${upstream}..HEAD --count`);
  const behind = run(`git rev-list HEAD..${upstream} --count`);

  if (Number(ahead) > 0) {
    fail(`Your branch is ahead of "${upstream}" by ${ahead} commit(s). Push before publishing.`);
  }
  if (Number(behind) > 0) {
    fail(`Your branch is behind "${upstream}" by ${behind} commit(s). Pull before publishing.`);
  }

  success('Git is clean and in sync with remote.');
}

async function promptVersion(currentVersion) {
  const rl = readline.createInterface({ input, output });
  try {
    console.log(`\nCurrent version: ${currentVersion}`);
    console.log('Choose bump type:');
    console.log(`  major \u2192 ${bumpVersion(currentVersion, 'major')} (breaking changes)`);
    console.log(`  minor \u2192 ${bumpVersion(currentVersion, 'minor')} (new features)`);
    console.log(`  patch \u2192 ${bumpVersion(currentVersion, 'patch')} (bug fixes)\n`);

    while (true) {
      const answer = (await rl.question('Bump type (major/minor/patch): ')).trim().toLowerCase();
      if (!BUMP_TYPES.includes(answer)) {
        console.log('  Invalid choice. Please enter: major, minor, or patch.');
        continue;
      }
      const next = bumpVersion(currentVersion, answer);
      const confirm = (await rl.question(`Confirm bump ${currentVersion} \u2192 ${next}? (y/N): `))
        .trim()
        .toLowerCase();
      if (confirm === 'y' || confirm === 'yes') {
        return next;
      }
    }
  } finally {
    rl.close();
  }
}

function updateVersion(pkgPath, newVersion) {
  const raw = readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  pkg.version = newVersion;
  const trailing = raw.endsWith('\n') ? '\n' : '';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailing);
}

async function main() {
  await checkGitClean();
  checkNpmLogin();

  const libraryPkg = JSON.parse(readFileSync(libraryPkgPath, 'utf8'));
  const newVersion = await promptVersion(libraryPkg.version);

  info(`Updating ${libraryPkgPath} to ${newVersion}`);
  updateVersion(libraryPkgPath, newVersion);

  info('Committing version bump...');
  runInherit(`git add "${libraryPkgPath}"`);
  runInherit(`git commit -m "Version ${newVersion}"`);

  info('Pushing to remote...');
  runInherit('git push');

  info('Building library...');
  runInherit('npm run build');

  info('Running tarball smoke tests...');
  runInherit('npm run smoke:pack');

  info('Publishing to npm...');
  const publishResult = spawnSync('npm', ['publish', './dist/angular', '--access', 'public'], {
    stdio: 'inherit',
    cwd: repoRoot,
  });

  if (publishResult.status !== 0) {
    fail('npm publish failed.');
  }

  success(`Published @ojiepermana/angular@${newVersion}`);
}

main().catch((err) => {
  fail(err?.message ?? String(err));
});
