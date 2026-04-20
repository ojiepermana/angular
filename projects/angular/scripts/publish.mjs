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
const rootPkgPath = resolve(repoRoot, 'package.json');

const SEMVER_RE = /^\d+\.\d+\.\d+$/;

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
    console.log('Enter the new version in format XX.YY.ZZ');
    console.log('  XX = major (breaking changes)');
    console.log('  YY = minor (new features)');
    console.log('  ZZ = patch (bug fixes)\n');

    while (true) {
      const answer = (await rl.question('New version: ')).trim();
      if (!SEMVER_RE.test(answer)) {
        console.log('  Invalid format. Please use XX.YY.ZZ (numbers only).');
        continue;
      }
      if (answer === currentVersion) {
        console.log('  New version must differ from the current version.');
        continue;
      }
      const confirm = (await rl.question(`Confirm bump ${currentVersion} \u2192 ${answer}? (y/N): `))
        .trim()
        .toLowerCase();
      if (confirm === 'y' || confirm === 'yes') {
        return answer;
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
  // Preserve trailing newline if present
  const trailing = raw.endsWith('\n') ? '\n' : '';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailing);
}

async function main() {
  await checkGitClean();

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
