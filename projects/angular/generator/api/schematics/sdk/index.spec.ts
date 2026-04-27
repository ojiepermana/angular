import { HostTree, type SchematicContext } from '@angular-devkit/schematics';
import { describe, expect, it, vi } from 'vitest';

import { resolveTarget } from '../../src/config/schema';
import type { GenerateResult } from '../../src/engine';
import { writeResult } from './index';

describe('writeResult', () => {
  it('removes stale generated files before writing the next SDK output', () => {
    const tree = new HostTree();
    tree.create('/sdk/obsolete.ts', 'obsolete');
    tree.create('/sdk/shared/old.ts', 'old');
    tree.create('/other/keep.ts', 'keep');

    const result: GenerateResult = {
      target: resolveTarget({
        input: './openapi.yaml',
        output: './sdk',
        mode: 'secondary-entrypoint',
        splitByDomain: true,
      }),
      outputDir: '/workspace/sdk',
      files: [
        { path: 'public-api.ts', content: 'root' },
        { path: 'shared/public-api.ts', content: 'shared' },
      ],
      stats: {
        schemas: 0,
        operations: 0,
        tags: 0,
        files: 2,
      },
    };

    const context = {
      logger: {
        info: vi.fn(),
      },
    } as unknown as SchematicContext;

    writeResult(tree, '/workspace', result, context);

    expect(tree.exists('/sdk/public-api.ts')).toBe(true);
    expect(tree.exists('/sdk/shared/public-api.ts')).toBe(true);
    expect(tree.exists('/sdk/obsolete.ts')).toBe(false);
    expect(tree.exists('/sdk/shared/old.ts')).toBe(false);
    expect(tree.readText('/other/keep.ts')).toBe('keep');
  });
});
