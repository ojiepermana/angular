import type {
  FieldRule,
  HttpMethod,
  ModelSchema,
  NavNode,
  Operation,
  OperationParam,
  SdkIR,
  SecurityScheme,
  ServerInfo,
  TagNode,
} from './types';

const HTTP_METHODS: readonly HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

/**
 * Build the Intermediate Representation from a bundled OpenAPI document.
 *
 * Expectations about input:
 *  - `$ref` strings in the form `#/components/schemas/<Name>` (or parameters).
 *  - OpenAPI 3.0.x / 3.1.x / 3.2.x (nullable via `type: ['string', 'null']` or
 *    `nullable: true`).
 */
export function buildIR(doc: any): SdkIR {
  const info = doc.info ?? {};
  const servers: ServerInfo[] = Array.isArray(doc.servers)
    ? doc.servers.map((s: any) => ({ url: String(s.url ?? ''), description: s.description }))
    : [];

  const tags: TagNode[] = Array.isArray(doc.tags)
    ? doc.tags.map((t: any) => ({
        name: String(t.name),
        parent: t.parent,
        kind: t.kind,
        xIcon: t['x-icon'],
        description: t.description,
      }))
    : [];

  const schemas = buildSchemas(doc.components?.schemas);
  const operations = buildOperations(doc.paths, doc.components?.parameters);
  const security = buildSecuritySchemes(doc.components?.securitySchemes);

  return {
    title: String(info.title ?? 'API'),
    version: String(info.version ?? '0.0.0'),
    description: info.description,
    servers,
    tags,
    navigation: buildNavigation(tags),
    schemas,
    operations,
    security,
  };
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

function buildSchemas(rawSchemas: Record<string, any> | undefined): ModelSchema[] {
  if (!rawSchemas) return [];
  const names = Object.keys(rawSchemas).sort();
  return names.map((name) => buildSchema(name, rawSchemas[name]));
}

function buildSchema(name: string, raw: any): ModelSchema {
  const required: string[] = Array.isArray(raw?.required) ? raw.required.slice() : [];
  const properties: Record<string, FieldRule> = {};

  // allOf — merge inline: fold each `properties` + required lists into the parent.
  const parts: any[] = Array.isArray(raw?.allOf) ? raw.allOf : [];
  const mergedProps: Record<string, any> = { ...(raw?.properties ?? {}) };
  for (const part of parts) {
    if (part?.properties) Object.assign(mergedProps, part.properties);
    if (Array.isArray(part?.required)) {
      for (const r of part.required) if (!required.includes(r)) required.push(r);
    }
  }

  for (const [propName, propSchema] of Object.entries(mergedProps)) {
    properties[propName] = buildFieldRule(propSchema as any, required.includes(propName));
  }

  // Primitive enum schemas → emit as alias.
  const primitiveType = resolvePrimitiveType(raw);
  if (primitiveType && Array.isArray(raw?.enum)) {
    return {
      name,
      description: raw?.description,
      required: [],
      properties: {},
      enumValues: raw.enum,
    };
  }

  // Array alias schemas.
  if (resolvedTypeIs(raw, 'array') && raw?.items) {
    const itemRef = refName(raw.items?.$ref);
    const itemType = itemRef ? undefined : resolvePrimitiveType(raw.items);
    return {
      name,
      description: raw?.description,
      required: [],
      properties: {},
      arrayItemRef: itemRef ?? undefined,
      arrayItemType: itemType ?? undefined,
    };
  }

  return {
    name,
    description: raw?.description,
    required,
    properties,
  };
}

function buildFieldRule(raw: any, required: boolean): FieldRule {
  const rule: FieldRule = { required };

  // $ref → named reference.
  const ref = refName(raw?.$ref);
  if (ref) {
    rule.ref = ref;
    return rule;
  }

  // Array with items.
  if (resolvedTypeIs(raw, 'array') && raw?.items) {
    rule.type = 'array';
    const itemsRef = refName(raw.items?.$ref);
    if (itemsRef) rule.itemsRef = itemsRef;
    else rule.itemsType = resolvePrimitiveType(raw.items) ?? 'unknown';
    const itemEnum = raw.items?.enum;
    if (Array.isArray(itemEnum)) rule.enumValues = itemEnum;
    if (raw.description) rule.description = raw.description;
    rule.nullable = isNullable(raw);
    return rule;
  }

  // Primitive / object.
  rule.type = resolvePrimitiveType(raw) ?? 'unknown';
  rule.nullable = isNullable(raw);
  if (raw?.format) rule.format = raw.format;
  if (raw?.description) rule.description = raw.description;
  if (typeof raw?.minLength === 'number') rule.minLength = raw.minLength;
  if (typeof raw?.maxLength === 'number') rule.maxLength = raw.maxLength;
  if (typeof raw?.minimum === 'number') rule.minimum = raw.minimum;
  if (typeof raw?.maximum === 'number') rule.maximum = raw.maximum;
  if (typeof raw?.pattern === 'string') rule.pattern = raw.pattern;
  if (Array.isArray(raw?.enum)) rule.enumValues = raw.enum;

  return rule;
}

function resolvePrimitiveType(raw: any): string | undefined {
  if (!raw) return undefined;
  const t = raw.type;
  if (Array.isArray(t)) {
    const nonNull = t.find((x: string) => x !== 'null');
    return nonNull ?? undefined;
  }
  if (typeof t === 'string') return t;
  return undefined;
}

function resolvedTypeIs(raw: any, target: string): boolean {
  return resolvePrimitiveType(raw) === target;
}

function isNullable(raw: any): boolean {
  if (raw?.nullable === true) return true;
  const t = raw?.type;
  if (Array.isArray(t) && t.includes('null')) return true;
  return false;
}

function refName(ref: unknown): string | undefined {
  if (typeof ref !== 'string') return undefined;
  const idx = ref.lastIndexOf('/');
  return idx >= 0 ? ref.slice(idx + 1) : ref;
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

function buildOperations(
  paths: Record<string, any> | undefined,
  sharedParams: Record<string, any> | undefined,
): Operation[] {
  if (!paths) return [];
  const operations: Operation[] = [];

  for (const [pathKey, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    const pathLevelParams: any[] = Array.isArray((pathItem as any).parameters) ? (pathItem as any).parameters : [];

    for (const method of HTTP_METHODS) {
      const op = (pathItem as any)[method];
      if (!op) continue;
      operations.push(buildOperation(pathKey, method, op, pathLevelParams, sharedParams));
    }
  }

  return operations.sort((a, b) => a.operationId.localeCompare(b.operationId));
}

function buildOperation(
  path: string,
  method: HttpMethod,
  op: any,
  pathLevelParams: any[],
  sharedParams: Record<string, any> | undefined,
): Operation {
  const tags: string[] = Array.isArray(op.tags) && op.tags.length ? op.tags.map(String) : ['Default'];
  const params = mergeParams(pathLevelParams, op.parameters, sharedParams);

  const body = op.requestBody;
  const bodySchemaRef = refName(body?.content?.['application/json']?.schema?.$ref) ?? refName(body?.$ref) ?? undefined;

  const responses: Record<string, string | undefined> = {};
  let successStatus: string | undefined;
  let successRef: string | undefined;
  for (const [status, resp] of Object.entries(op.responses ?? {})) {
    const r = resp as any;
    const ref = refName(r?.content?.['application/json']?.schema?.$ref) ?? refName(r?.$ref) ?? undefined;
    responses[status] = ref;
    if (!successStatus && status.startsWith('2')) {
      successStatus = status;
      successRef = ref;
    }
  }

  const securitySchemes: string[] = [];
  if (Array.isArray(op.security)) {
    for (const s of op.security) {
      if (s && typeof s === 'object') {
        for (const key of Object.keys(s)) {
          if (!securitySchemes.includes(key)) securitySchemes.push(key);
        }
      }
    }
  }

  const requiredPermissions: string[] = Array.isArray(op['x-required-permissions'])
    ? op['x-required-permissions'].map(String)
    : [];
  const authorizationNotes: string[] = Array.isArray(op['x-authorization-notes'])
    ? op['x-authorization-notes'].map(String)
    : [];

  const operationId = op.operationId ?? synthesizeOperationId(method, path);

  return {
    operationId,
    method,
    path,
    tag: tags[0],
    tags,
    summary: op.summary,
    description: op.description,
    params,
    bodySchemaRef,
    bodyRequired: body?.required === true,
    responses,
    successStatus,
    successRef,
    securitySchemes,
    requiredPermissions,
    authorizationNotes,
  };
}

function mergeParams(
  pathLevelParams: any[],
  opParams: any[] | undefined,
  sharedParams: Record<string, any> | undefined,
): OperationParam[] {
  const all = [...(pathLevelParams ?? []), ...((opParams as any[]) ?? [])];
  const seen = new Set<string>();
  const out: OperationParam[] = [];
  for (const raw of all) {
    const resolved = resolveParamRef(raw, sharedParams);
    if (!resolved?.name || !resolved?.in) continue;
    const key = `${resolved.in}:${resolved.name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const loc: OperationParam['in'] =
      resolved.in === 'path' || resolved.in === 'query' || resolved.in === 'header' ? resolved.in : 'query';
    const rule = buildFieldRule(resolved.schema ?? {}, !!resolved.required);
    out.push({
      name: resolved.name,
      in: loc,
      required: !!resolved.required,
      rule,
    });
  }
  return out;
}

function resolveParamRef(raw: any, sharedParams: Record<string, any> | undefined): any {
  if (!raw) return raw;
  if (typeof raw.$ref !== 'string') return raw;
  const name = refName(raw.$ref);
  if (!name || !sharedParams) return raw;
  return sharedParams[name] ?? raw;
}

function synthesizeOperationId(method: HttpMethod, path: string): string {
  const cleaned = path
    .replace(/\/+/g, '/')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/^\{/, 'by-').replace(/\}$/, ''))
    .join('-');
  return `${method}-${cleaned || 'root'}`;
}

// ---------------------------------------------------------------------------
// Security & navigation
// ---------------------------------------------------------------------------

function buildSecuritySchemes(raw: Record<string, any> | undefined): SecurityScheme[] {
  if (!raw) return [];
  return Object.entries(raw).map(([name, s]) => ({
    name,
    type: String((s as any).type ?? 'unknown'),
    scheme: (s as any).scheme,
    bearerFormat: (s as any).bearerFormat,
    in: (s as any).in,
  }));
}

function buildNavigation(tags: readonly TagNode[]): NavNode[] {
  const byName = new Map<string, NavNode>();
  for (const t of tags) {
    byName.set(t.name, { name: t.name, xIcon: t.xIcon, description: t.description, children: [] });
  }

  const roots: NavNode[] = [];
  for (const t of tags) {
    const node = byName.get(t.name)!;
    if (t.parent && byName.has(t.parent)) {
      byName.get(t.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
