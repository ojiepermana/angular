/**
 * Post-build step for the @ojiepermana/angular package.
 *
 * Copies the schematic collection plus each generator's compiled `bin/`,
 * JSON schemas, example configs and README into the published package, and
 * patches `dist/angular/package.json` with the `schematics` field.
 *
 * Both generators (`generator/api`, `generator/guide`) live inside the parent
 * library; they are not separate npm packages and have no `package.json` of
 * their own.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDir, '../../../');
const projectRoot = resolve(workspaceRoot, 'projects/angular');
const distPackageRoot = resolve(workspaceRoot, 'dist/angular');

if (!existsSync(distPackageRoot)) {
  throw new Error('dist/angular not found. Run `ng build angular` first.');
}

// 1. Root-level collection.
copyInto(projectRoot, distPackageRoot, 'collection.json');

// 2. Per-generator artefacts.
const generators = [
  {
    name: 'api',
    files: [
      'README.md',
      'sdk.config.example.json',
      'schematics/sdk/schema.json',
      'schematics/init/schema.json',
      'schematics/ng-add/schema.json',
    ],
    dirs: ['bin'],
    exportPath: './generator/api',
  },
  {
    name: 'guide',
    files: ['README.md', 'guide.config.example.json', 'schematics/build/schema.json', 'schematics/init/schema.json'],
    dirs: ['bin'],
    exportPath: './generator/guide',
  },
];

for (const gen of generators) {
  const sourceDir = resolve(projectRoot, 'generator', gen.name);
  const distDir = resolve(distPackageRoot, 'generator', gen.name);
  for (const file of gen.files) copyInto(sourceDir, distDir, file);
  for (const dir of gen.dirs) copyDirInto(sourceDir, distDir, dir);
}

// 3. Patch the root package.json: add schematics + secondary-entry exports.
patchRootPackage();

function patchRootPackage() {
  const rootPackagePath = resolve(distPackageRoot, 'package.json');
  const rootMeta = readJson(rootPackagePath);

  rootMeta.schematics = './collection.json';

  const exports = { ...(rootMeta.exports ?? {}) };
  for (const gen of generators) {
    const secondaryPackagePath = resolve(distPackageRoot, 'generator', gen.name, 'package.json');
    if (!existsSync(secondaryPackagePath)) continue;
    const secondaryMeta = readJson(secondaryPackagePath);
    if (!secondaryMeta.typings || !secondaryMeta.module) continue;
    exports[gen.exportPath] = {
      types: toExportPath(resolve(distPackageRoot, 'generator', gen.name, secondaryMeta.typings)),
      default: toExportPath(resolve(distPackageRoot, 'generator', gen.name, secondaryMeta.module)),
    };
  }
  rootMeta.exports = exports;

  writeJson(rootPackagePath, rootMeta);
}

function copyInto(fromRoot, toRoot, relativePath) {
  const from = resolve(fromRoot, relativePath);
  if (!existsSync(from)) return;
  const to = resolve(toRoot, relativePath);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}

function copyDirInto(fromRoot, toRoot, relativePath) {
  const from = resolve(fromRoot, relativePath);
  if (!existsSync(from)) return;
  const to = resolve(toRoot, relativePath);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function toExportPath(absolutePath) {
  return `./${relative(distPackageRoot, absolutePath).split('\\').join('/')}`;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
