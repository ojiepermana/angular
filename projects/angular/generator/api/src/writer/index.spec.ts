import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveTarget } from '../config/schema';
import type { SdkIR } from '../parser/types';
import type { VirtualFile } from '../render/template';
import { writeLibrary, writeSecondaryEntrypoint } from './index';

const ir: SdkIR = {
  title: 'Test API',
  version: '1.0.0',
  servers: [],
  tags: [],
  navigation: [],
  schemas: [],
  operations: [],
  security: [],
};

const files: VirtualFile[] = [
  { path: 'public-api.ts', content: '' },
  { path: 'shared/public-api.ts', content: '' },
  { path: 'approval/public-api.ts', content: '' },
  { path: 'storage/gcs/public-api.ts', content: '' },
];

const splitFiles: VirtualFile[] = [
  {
    path: 'public-api.ts',
    content: "export * from './shared/public-api';\nexport * from './approval/public-api';\n",
  },
  {
    path: 'shared/public-api.ts',
    content: "export * from './validators/index';\nexport { BaseService } from './base-service';\n",
  },
  {
    path: 'shared/base-service.ts',
    content: 'export class BaseService {}\n',
  },
  {
    path: 'shared/validators/index.ts',
    content: 'export const apiValidationSchemas = {};\n',
  },
  {
    path: 'approval/public-api.ts',
    content: "export { approvalOperationRules } from './permissions/approval';\n",
  },
  {
    path: 'approval/services/approval.service.ts',
    content:
      "import { BaseService } from '../../shared/base-service';\nexport class ApprovalService extends BaseService {}\n",
  },
  {
    path: 'approval/permissions/approval.ts',
    content: 'export const approvalOperationRules = {};\n',
  },
];

describe('writer', () => {
  it('adds nested ng-package manifests for every split-by-domain entrypoint in library mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      mode: 'library',
      packageName: '@scope/sdk',
      splitByDomain: true,
    });

    const paths = writeLibrary(files, ir, target, '/workspace', '/workspace/sdk').map((file) => file.path);

    expect(paths).toContain('ng-package.json');
    expect(paths).toContain('shared/ng-package.json');
    expect(paths).toContain('approval/ng-package.json');
    expect(paths).toContain('storage/gcs/ng-package.json');
  });

  it('computes the ng-package schema and dest relative to the output directory in library mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './tools/generated/sdk',
      mode: 'library',
      packageName: '@scope/sdk',
      splitByDomain: true,
    });

    const result = writeLibrary(files, ir, target, '/workspace', '/workspace/tools/generated/sdk');
    const ngPackage = result.find((file) => file.path === 'ng-package.json');

    expect(ngPackage?.content).toContain('"$schema": "../../../node_modules/ng-packagr/ng-package.schema.json"');
    expect(ngPackage?.content).toContain('"dest": "../../../dist/scope-sdk"');
  });

  it('rewrites non-root cross-entrypoint imports to package subpaths in library mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      mode: 'library',
      packageName: '@scope/sdk',
      splitByDomain: true,
    });

    const result = writeLibrary(splitFiles, ir, target, '/workspace', '/workspace/sdk');
    const approvalPublicApi = result.find((file) => file.path === 'approval/public-api.ts');
    const approvalService = result.find((file) => file.path === 'approval/services/approval.service.ts');
    const rootPublicApi = result.find((file) => file.path === 'public-api.ts');

    expect(approvalPublicApi?.content).not.toContain("from '@scope/sdk/shared';");
    expect(approvalService?.content).toContain("from '@scope/sdk/shared';");
    expect(rootPublicApi?.content).toContain("export * from './shared/public-api';");
  });

  it('adds nested ng-package manifests for every split-by-domain entrypoint in secondary-entrypoint mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      mode: 'secondary-entrypoint',
      splitByDomain: true,
    });

    const paths = writeSecondaryEntrypoint(files, ir, target, '/workspace', '/workspace/sdk').map((file) => file.path);

    expect(paths).toContain('ng-package.json');
    expect(paths).toContain('shared/ng-package.json');
    expect(paths).toContain('approval/ng-package.json');
    expect(paths).toContain('storage/gcs/ng-package.json');
  });

  it('infers the parent package name for secondary-entrypoint cross-entrypoint imports', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sdk-writer-'));
    const libraryRoot = resolve(tempRoot, 'projects/angular');
    const outputDir = resolve(libraryRoot, 'sdk');
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(libraryRoot, 'package.json'), JSON.stringify({ name: '@scope/angular' }, null, 2));
    writeFileSync(
      resolve(libraryRoot, 'ng-package.json'),
      JSON.stringify({ lib: { entryFile: 'public-api.ts' } }, null, 2),
    );

    const target = resolveTarget({
      input: './openapi.yaml',
      output: './projects/angular/sdk',
      mode: 'secondary-entrypoint',
      splitByDomain: true,
    });

    const result = writeSecondaryEntrypoint(splitFiles, ir, target, tempRoot, outputDir);
    const approvalPublicApi = result.find((file) => file.path === 'approval/public-api.ts');
    const approvalService = result.find((file) => file.path === 'approval/services/approval.service.ts');

    expect(approvalPublicApi?.content).not.toContain("from '@scope/angular/sdk/shared';");
    expect(approvalService?.content).toContain("from '@scope/angular/sdk/shared';");
  });
});
