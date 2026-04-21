#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../../..');
const distPackageRoot = resolve(repoRoot, 'dist/angular');
const rootPackage = readJson(resolve(repoRoot, 'package.json'));
const angularCliVersion = normalizeVersion(rootPackage.devDependencies?.['@angular/cli']);

const OPENAPI_FIXTURE = `openapi: 3.0.3
info:
  title: Smoke API
  version: 1.0.0
paths:
  /health:
    get:
      tags:
        - Health
      operationId: getHealth
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthResponse'
components:
  schemas:
    HealthResponse:
      type: object
      required:
        - status
      properties:
        status:
          type: string
`;

const GUIDE_FIXTURE = `---
title: Smoke Guide
order: 1
---

# Smoke Guide

This file verifies the published guide schematic can read markdown input.
`;

main();

function main() {
  if (!existsSync(distPackageRoot)) {
    fail('dist/angular not found. Run `bun run build` first.');
  }
  if (!angularCliVersion) {
    fail('Unable to determine the Angular CLI version from package.json.');
  }

  const tempRoot = mkdtempSync(join(tmpdir(), 'ojie-angular-pack-smoke-'));
  const tarballPath = packTarball(tempRoot);
  const appDir = createConsumerWorkspace(tempRoot);

  installConsumerDependencies(appDir, tarballPath);

  const appNgCli = resolve(appDir, 'node_modules/@angular/cli/bin/ng.js');
  if (!existsSync(appNgCli)) {
    fail('Consumer workspace is missing a local Angular CLI install after npm install.');
  }

  smokeSdk(appDir, appNgCli);
  smokeGuide(appDir, appNgCli);

  success(`Package smoke tests passed in ${tempRoot}`);
}

function packTarball(tempRoot) {
  info('Packing dist/angular into a tarball...');
  const output = runCapture('npm', ['pack', distPackageRoot, '--pack-destination', tempRoot, '--json'], {
    cwd: repoRoot,
  });
  const result = JSON.parse(output);
  if (!Array.isArray(result) || result.length === 0 || typeof result[0]?.filename !== 'string') {
    fail(`Unexpected npm pack output: ${output}`);
  }
  return resolve(tempRoot, result[0].filename);
}

function createConsumerWorkspace(tempRoot) {
  info('Creating a temporary Angular consumer workspace...');
  run(
    'npx',
    [
      '--yes',
      `@angular/cli@${angularCliVersion}`,
      'new',
      'smoke-consumer',
      '--defaults',
      '--minimal',
      '--skip-git',
      '--skip-install',
      '--package-manager',
      'npm',
      '--style',
      'css',
    ],
    { cwd: tempRoot },
  );
  return resolve(tempRoot, 'smoke-consumer');
}

function installConsumerDependencies(appDir, tarballPath) {
  info('Installing the base Angular app dependencies...');
  run('npm', ['install', '--no-fund', '--no-audit'], { cwd: appDir });

  info('Installing the packed library plus required peer dependencies...');
  const distPackage = readJson(resolve(distPackageRoot, 'package.json'));
  const appPackage = readJson(resolve(appDir, 'package.json'));
  const existingDeps = new Set([
    ...Object.keys(appPackage.dependencies ?? {}),
    ...Object.keys(appPackage.devDependencies ?? {}),
  ]);

  const peerDeps = Object.entries(distPackage.peerDependencies ?? {})
    .filter(([name]) => !existingDeps.has(name))
    .map(([name, version]) => `${name}@${version}`);

  const installedAngularCore = readJson(resolve(appDir, 'node_modules/@angular/core/package.json'));
  const appAngularVersion = normalizeVersion(installedAngularCore.version);
  const extraDeps =
    !existingDeps.has('@angular/animations') && appAngularVersion ? [`@angular/animations@${appAngularVersion}`] : [];

  run('npm', ['install', '--no-fund', '--no-audit', tarballPath, ...peerDeps, ...extraDeps], { cwd: appDir });
}

function smokeSdk(appDir, appNgCli) {
  info('Running SDK schematic smoke tests...');
  run('node', [appNgCli, 'generate', '@ojiepermana/angular:sdk-init', '--dry-run'], { cwd: appDir });

  mkdirSync(resolve(appDir, 'config'), { recursive: true });
  writeText(resolve(appDir, 'openapi.yaml'), OPENAPI_FIXTURE);
  writeJson(resolve(appDir, 'config/sdk.config.json'), {
    $schema: '../node_modules/@ojiepermana/angular/generator/api/schematics/sdk/schema.json',
    targets: [
      {
        input: './openapi.yaml',
        output: './src/app/generated-sdk',
        mode: 'standalone',
        clientName: 'SmokeApi',
        rootUrl: '',
        splitByDomain: false,
        splitDepth: 'service',
        features: {
          models: true,
          operations: true,
          services: true,
          client: true,
          metadata: true,
          navigation: true,
        },
      },
    ],
  });

  run('node', [appNgCli, 'generate', '@ojiepermana/angular:sdk', '--dry-run'], { cwd: appDir });
}

function smokeGuide(appDir, appNgCli) {
  info('Running guide schematic smoke tests...');
  run('node', [appNgCli, 'generate', '@ojiepermana/angular:guide-init', '--dry-run'], { cwd: appDir });

  mkdirSync(resolve(appDir, 'docs'), { recursive: true });
  mkdirSync(resolve(appDir, 'config'), { recursive: true });
  writeText(resolve(appDir, 'docs/index.md'), GUIDE_FIXTURE);
  writeJson(resolve(appDir, 'config/guide.config.json'), {
    $schema: '../node_modules/@ojiepermana/angular/generator/guide/schematics/build/schema.json',
    sourceDir: './docs',
    outputDir: './src/app/generated-guide',
    routeFile: 'doc.routes.ts',
    componentPrefix: 'Doc',
    componentStyle: 'none',
    routeExportName: 'DOC_ROUTES',
  });

  run('node', [appNgCli, 'generate', '@ojiepermana/angular:guide', '--dry-run'], { cwd: appDir });
}

function run(command, args, options) {
  execFileSync(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: '1',
      NG_CLI_ANALYTICS: 'false',
    },
    ...options,
  });
}

function runCapture(command, args, options) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    env: {
      ...process.env,
      CI: '1',
      NG_CLI_ANALYTICS: 'false',
    },
    ...options,
  }).trim();
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function normalizeVersion(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/^[~^]+/, '');
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, content) {
  writeFileSync(path, content);
}

function info(message) {
  console.log(`→ ${message}`);
}

function success(message) {
  console.log(`✓ ${message}`);
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}
