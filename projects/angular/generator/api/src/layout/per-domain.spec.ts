import { describe, expect, it } from 'vitest';

import { resolveTarget } from '../config/schema';
import { emitMetadata } from '../emit/metadata';
import type { SdkIR } from '../parser/types';
import { relayoutPerDomain } from './per-domain';

function createIr(): SdkIR {
  return {
    title: 'Test API',
    version: '1.0.0',
    servers: [],
    navigation: [],
    security: [],
    schemas: [
      {
        name: 'SharedThing',
        required: [],
        properties: {},
      },
    ],
    tags: [{ name: 'Approval' }, { name: 'Access' }],
    operations: [
      {
        operationId: 'getApproval',
        method: 'get',
        path: '/approval',
        tag: 'Approval',
        tags: ['Approval'],
        params: [],
        bodyRequired: false,
        responses: {},
        securitySchemes: [],
        requiredPermissions: ['approval.read'],
        authorizationNotes: [],
      },
      {
        operationId: 'getAccess',
        method: 'get',
        path: '/access',
        tag: 'Access',
        tags: ['Access'],
        params: [],
        bodyRequired: false,
        responses: {},
        securitySchemes: [],
        requiredPermissions: ['access.read'],
        authorizationNotes: [],
      },
    ],
  };
}

describe('relayoutPerDomain', () => {
  it('keeps aggregated metadata at the root barrel in split-by-domain mode', () => {
    const ir = createIr();
    const target = resolveTarget({
      input: './openapi.yaml',
      output: './sdk',
      splitByDomain: true,
      splitDepth: 'service',
      features: {
        client: false,
        models: false,
        operations: false,
        services: false,
        metadata: true,
        navigation: false,
      },
    });

    const result = relayoutPerDomain(emitMetadata(ir, target), ir, target);
    const files = new Map(result.map((file) => [file.path, file.content] as const));

    expect(files.has('metadata.ts')).toBe(true);
    expect(files.has('openapi-helpers.ts')).toBe(true);
    expect(files.has('permissions/index.ts')).toBe(true);

    expect(files.has('shared/metadata.ts')).toBe(false);
    expect(files.has('shared/openapi-helpers.ts')).toBe(false);
    expect(files.has('shared/permissions/index.ts')).toBe(false);

    expect(files.get('metadata.ts')).toContain("export * from './shared/metadata-types';");
    expect(files.get('metadata.ts')).toContain("export * from './permissions/index';");
    expect(files.get('metadata.ts')).toContain("export * from './shared/validators/index';");

    expect(files.get('shared/public-api.ts')).toContain("export * from './metadata-types';");
    expect(files.get('shared/public-api.ts')).toContain("export * from './validators/index';");
    expect(files.get('shared/public-api.ts')).not.toContain("export * from './metadata';");
    expect(files.get('shared/public-api.ts')).not.toContain("export * from './openapi-helpers';");

    expect(files.get('approval/public-api.ts')).toContain(
      "export { approvalOperationRules } from './permissions/approval';",
    );
    expect(files.get('access/public-api.ts')).toContain("export { accessOperationRules } from './permissions/access';");

    expect(files.get('public-api.ts')).toContain("export * from './metadata';");
    expect(files.get('public-api.ts')).toContain("export * from './openapi-helpers';");
  });
});
