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

describe('writer', () => {
  it('adds nested ng-package manifests for every split-by-domain entrypoint in library mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      mode: 'library',
      packageName: '@scope/sdk',
      splitByDomain: true,
    });

    const paths = writeLibrary(files, ir, target).map((file) => file.path);

    expect(paths).toContain('ng-package.json');
    expect(paths).toContain('shared/ng-package.json');
    expect(paths).toContain('approval/ng-package.json');
    expect(paths).toContain('storage/gcs/ng-package.json');
  });

  it('adds nested ng-package manifests for every split-by-domain entrypoint in secondary-entrypoint mode', () => {
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      mode: 'secondary-entrypoint',
      splitByDomain: true,
    });

    const paths = writeSecondaryEntrypoint(files, ir, target).map((file) => file.path);

    expect(paths).toContain('ng-package.json');
    expect(paths).toContain('shared/ng-package.json');
    expect(paths).toContain('approval/ng-package.json');
    expect(paths).toContain('storage/gcs/ng-package.json');
  });
});
