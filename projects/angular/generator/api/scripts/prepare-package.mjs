import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDir, '../../../../../');
const sourceRoot = resolve(workspaceRoot, 'projects/angular/generator/api');
const distPackageRoot = resolve(workspaceRoot, 'dist/angular');
const distRoot = resolve(distPackageRoot, 'generator/api');

if (!existsSync(distRoot)) {
  throw new Error(
    'dist/angular/generator/api was not created. Ensure projects/angular/generator/api is a valid ng-packagr secondary entrypoint.',
  );
}

copyFile('README.md');
copyFile('collection.json');
copyFile('sdk.config.example.json');
copyDirectory('bin');
copyFile('schematics/init/schema.json');
copyFile('schematics/sdk/schema.json');
patchSecondaryPackage();
patchRootExports();

function copyFile(relativePath) {
  const from = resolve(sourceRoot, relativePath);
  const to = resolve(distRoot, relativePath);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}

function copyDirectory(relativePath) {
  const from = resolve(sourceRoot, relativePath);
  const to = resolve(distRoot, relativePath);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function patchSecondaryPackage() {
  const sourceMeta = readJson(resolve(sourceRoot, 'package.json'));
  const distMeta = readJson(resolve(distRoot, 'package.json'));

  const nextMeta = {
    ...distMeta,
    name: sourceMeta.name,
    description: sourceMeta.description,
    schematics: sourceMeta.schematics,
    sideEffects: false,
  };

  writeJson(resolve(distRoot, 'package.json'), nextMeta);
}

function patchRootExports() {
  const rootPackagePath = resolve(distPackageRoot, 'package.json');
  const rootMeta = readJson(rootPackagePath);
  const secondaryMeta = readJson(resolve(distRoot, 'package.json'));

  const typeTarget = toExportPath(resolve(distRoot, secondaryMeta.typings));
  const moduleTarget = toExportPath(resolve(distRoot, secondaryMeta.module));

  rootMeta.exports = {
    ...(rootMeta.exports ?? {}),
    './generator/api': {
      types: typeTarget,
      default: moduleTarget,
    },
  };

  writeJson(rootPackagePath, rootMeta);
}

function toExportPath(absolutePath) {
  return `./${relative(distPackageRoot, absolutePath).split('\\').join('/')}`;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
