import type { ResolvedSdkTarget } from '../config/schema';
import type { ModelSchema, Operation, SdkIR } from '../parser/types';
import { finalize, kebabCase, type VirtualFile } from '../render/template';

/**
 * Emit frontend-friendly metadata:
 *   - `metadata-types.ts`            shared rule types
 *   - `permissions/<tag>.ts`         operation rules (per tag) + `index.ts`
 *   - `validators/<tag>.ts`          schema validation rules (per tag) + `index.ts`
 *   - `metadata.ts`                  aggregate export
 *   - `openapi-helpers.ts`           small helpers (`getRequiredPermissions`, etc)
 */
export function emitMetadata(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const files: VirtualFile[] = [];
  files.push({ path: 'metadata-types.ts', content: finalize(metadataTypesFile(target)) });

  const opsByTag = groupOps(ir.operations);
  for (const [tag, ops] of opsByTag) {
    files.push({
      path: `permissions/${kebabCase(tag)}.ts`,
      content: finalize(permissionFile(tag, ops, target)),
    });
  }
  const permTags = Array.from(opsByTag.keys());
  files.push({
    path: 'permissions/index.ts',
    content: finalize(
      buildAggregateFile(
        target,
        permTags,
        'ApiOperationRule',
        'apiOperationRules',
        (t) => `${toCamel(t)}OperationRules`,
      ),
    ),
  });

  const schemasByPrefix = groupSchemas(ir.schemas);
  for (const [group, schemas] of schemasByPrefix) {
    files.push({
      path: `validators/${kebabCase(group)}.ts`,
      content: finalize(validatorFile(group, schemas, target)),
    });
  }
  const valGroups = Array.from(schemasByPrefix.keys());
  files.push({
    path: 'validators/index.ts',
    content: finalize(
      buildAggregateFile(
        target,
        valGroups,
        'ApiSchemaRule',
        'apiValidationSchemas',
        (g) => `${toCamel(g)}ValidationSchemas`,
      ),
    ),
  });

  files.push({ path: 'metadata.ts', content: finalize(metadataFile(target)) });
  files.push({ path: 'openapi-helpers.ts', content: finalize(helpersFile(target)) });

  return files;
}

/**
 * Emit a per-feature `index.ts` that re-exports each per-tag module plus a
 * single aggregated record (`apiOperationRules`, `apiValidationSchemas`).
 */
function buildAggregateFile(
  target: ResolvedSdkTarget,
  groups: readonly string[],
  typeName: string,
  aggregateName: string,
  varNameFor: (group: string) => string,
): string {
  const reexports = groups.map((g) => `export { ${varNameFor(g)} } from './${kebabCase(g)}';`).join('\n');
  const imports = groups.map((g) => `import { ${varNameFor(g)} } from './${kebabCase(g)}';`).join('\n');
  const spreads = groups.map((g) => `  ...${varNameFor(g)},`).join('\n');
  return `${target.banner}

import type { ${typeName} } from '../metadata-types';
${imports}

${reexports}

export const ${aggregateName}: Record<string, ${typeName}> = {
${spreads}
};
`;
}

function metadataTypesFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

export interface ApiFieldRule {
  required?: boolean;
  type?: string;
  format?: string;
  description?: string;
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enumValues?: readonly (string | number)[];
  ref?: string;
  itemsRef?: string;
  itemsType?: string;
}

export interface ApiSchemaRule {
  required: readonly string[];
  properties: Record<string, ApiFieldRule>;
}

export interface ApiOperationRule {
  method: string;
  path: string;
  tags: readonly string[];
  summary?: string;
  description?: string;
  requiredPermissions: readonly string[];
  authorizationNotes: readonly string[];
  securitySchemes: readonly string[];
  pathParams: Record<string, ApiFieldRule>;
  queryParams: Record<string, ApiFieldRule>;
  bodySchema?: string;
  responseSchemas: Record<string, string | undefined>;
}
`;
}

function permissionFile(tag: string, ops: readonly Operation[], target: ResolvedSdkTarget): string {
  const entries = ops
    .slice()
    .sort((a, b) => a.operationId.localeCompare(b.operationId))
    .map((op) => renderOperationRule(op));
  return `${target.banner}

import type { ApiOperationRule } from '../metadata-types';

export const ${toCamel(tag)}OperationRules: Record<string, ApiOperationRule> = {
${entries.join(',\n')},
};
`;
}

function renderOperationRule(op: Operation): string {
  const pathParams: Record<string, unknown> = {};
  const queryParams: Record<string, unknown> = {};
  for (const p of op.params) {
    const rule = trimRule(p.rule, p.required);
    if (p.in === 'path') pathParams[p.name] = rule;
    else if (p.in === 'query') queryParams[p.name] = rule;
  }
  const obj = {
    method: op.method.toUpperCase(),
    path: op.path,
    tags: op.tags,
    summary: op.summary,
    description: op.description,
    requiredPermissions: op.requiredPermissions,
    authorizationNotes: op.authorizationNotes,
    securitySchemes: op.securitySchemes,
    pathParams,
    queryParams,
    bodySchema: op.bodySchemaRef,
    responseSchemas: op.responses,
  };
  return `  ${JSON.stringify(op.operationId)}: ${toInlineJson(obj, 2)}`;
}

function validatorFile(group: string, schemas: readonly ModelSchema[], target: ResolvedSdkTarget): string {
  const entries = schemas
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => renderSchemaRule(s));
  return `${target.banner}

import type { ApiSchemaRule } from '../metadata-types';

export const ${toCamel(group)}ValidationSchemas: Record<string, ApiSchemaRule> = {
${entries.join(',\n')},
};
`;
}

function renderSchemaRule(schema: ModelSchema): string {
  const properties: Record<string, unknown> = {};
  for (const [name, rule] of Object.entries(schema.properties)) {
    properties[name] = trimRule(rule, rule.required === true);
  }
  const obj = {
    required: schema.required,
    properties,
  };
  return `  ${JSON.stringify(schema.name)}: ${toInlineJson(obj, 2)}`;
}

function metadataFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

export * from './metadata-types';
export * from './permissions';
export * from './validators';
`;
}

function helpersFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

import { apiOperationRules, apiValidationSchemas } from './metadata';
import type { ApiFieldRule, ApiOperationRule, ApiSchemaRule } from './metadata-types';

export function getSchemaRule(schemaName: string): ApiSchemaRule | undefined {
  return apiValidationSchemas[schemaName];
}

export function getFieldRule(schemaName: string, fieldName: string): ApiFieldRule | undefined {
  return apiValidationSchemas[schemaName]?.properties[fieldName];
}

export function getOperationRule(operationId: string): ApiOperationRule | undefined {
  return apiOperationRules[operationId];
}

export function getRequiredPermissions(operationId: string): readonly string[] {
  return apiOperationRules[operationId]?.requiredPermissions ?? [];
}

export function hasRequiredPermissions(
  operationId: string,
  ownedPermissions: readonly string[],
): boolean {
  return getRequiredPermissions(operationId).every((p) => ownedPermissions.includes(p));
}
`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupOps(operations: readonly Operation[]): Map<string, Operation[]> {
  const map = new Map<string, Operation[]>();
  for (const op of operations) {
    const bucket = map.get(op.tag) ?? [];
    bucket.push(op);
    map.set(op.tag, bucket);
  }
  return map;
}

/**
 * Group schemas for validator output by a common prefix tag. We use a simple
 * heuristic: first PascalCase word of the schema name (e.g. `UserListResponse`
 * → `User`, `AuthTokenResponse` → `Auth`). Keeps file sizes small and mirrors
 * the reference layout.
 */
function groupSchemas(schemas: readonly ModelSchema[]): Map<string, ModelSchema[]> {
  const map = new Map<string, ModelSchema[]>();
  for (const s of schemas) {
    const prefix = detectSchemaGroup(s.name);
    const bucket = map.get(prefix) ?? [];
    bucket.push(s);
    map.set(prefix, bucket);
  }
  return map;
}

function detectSchemaGroup(name: string): string {
  const match = name.match(/^([A-Z][a-z]+)/);
  return match ? match[1] : 'Shared';
}

function trimRule(rule: any, required: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (required) out.required = true;
  else out.required = false;
  if (rule.type) out.type = rule.type;
  if (rule.format) out.format = rule.format;
  if (rule.description) out.description = rule.description;
  if (rule.nullable) out.nullable = true;
  if (typeof rule.minLength === 'number') out.minLength = rule.minLength;
  if (typeof rule.maxLength === 'number') out.maxLength = rule.maxLength;
  if (typeof rule.minimum === 'number') out.minimum = rule.minimum;
  if (typeof rule.maximum === 'number') out.maximum = rule.maximum;
  if (rule.pattern) out.pattern = rule.pattern;
  if (rule.enumValues && rule.enumValues.length) out.enumValues = rule.enumValues;
  if (rule.ref) out.ref = rule.ref;
  if (rule.itemsRef) out.itemsRef = rule.itemsRef;
  if (rule.itemsType) out.itemsType = rule.itemsType;
  return out;
}

/** Stable JSON output with stripped `undefined` values. */
function toInlineJson(value: unknown, indent: number): string {
  const pretty = JSON.stringify(value, (_key, val) => (val === undefined ? undefined : val), 2);
  if (!pretty) return 'undefined';
  return pretty
    .split('\n')
    .map((line, i) => (i === 0 ? line : ' '.repeat(indent) + line))
    .join('\n');
}

function toCamel(input: string): string {
  const parts = String(input)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return 'shared';
  return parts
    .map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}
