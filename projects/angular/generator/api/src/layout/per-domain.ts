/**
 * Post-emit transform that reorganises the flat generator output into a
 * per-domain layout:
 *
 * ```
 *   <outputDir>/
 *     shared/                 client primitives, shared models, metadata types, validators
 *     metadata.ts             aggregate metadata barrel (root only)
 *     openapi-helpers.ts      metadata helpers (root only)
 *     permissions/index.ts    aggregate operation rules (root only)
 *     <domain>/               one folder per OpenAPI tag (kebab-cased)
 *       models/               models only referenced by this domain
 *       fn/                   tree-shakeable operation functions for this domain
 *       services/             Injectable service class(es) for this domain
 *       permissions/          per-tag permission rules
 *       public-api.ts
 *     public-api.ts           aggregator: re-exports shared + every domain
 * ```
 *
 * The emitters themselves are not aware of the transform — they keep producing
 * flat paths and relative imports. This module walks the emitted virtual files,
 * rewrites their paths, and patches relative imports so everything still lines
 * up.
 */
import { dirname, posix, relative } from 'node:path';

import type { ResolvedSdkTarget } from '../config/schema';
import type { SdkIR } from '../parser/types';
import { finalize, kebabCase, pascalCase, camelCase, type VirtualFile } from '../render/template';

const SHARED = 'shared';
const VIRTUAL_ROOT = '/__sdk__';

interface Mapping {
  readonly oldToNew: Map<string, string>;
  readonly modelOwner: Map<string, string>;
  readonly domains: readonly string[];
  readonly domainOperations: Map<string, string[]>;
  readonly domainServices: Map<string, string[]>;
}

export function relayoutPerDomain(files: VirtualFile[], ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const mapping = computeMapping(files, ir, target);

  // 1. Rewrite paths + relative imports, drop the original public-api.ts so we
  //    can regenerate it with domain awareness.
  const rewritten: VirtualFile[] = [];
  for (const file of files) {
    if (file.path === 'public-api.ts') continue;
    const newPath = mapping.oldToNew.get(file.path);
    if (!newPath) continue;
    rewritten.push({
      path: newPath,
      content: rewriteImports(file.content, file.path, newPath, mapping.oldToNew),
    });
  }

  // 2. Emit per-domain + root public-api.ts.
  rewritten.push(...emitPublicApis(ir, target, mapping));

  return rewritten;
}

function computeMapping(files: readonly VirtualFile[], ir: SdkIR, target: ResolvedSdkTarget): Mapping {
  // Domain per tag. Two strategies are supported, selected by
  // `target.splitDepth`:
  //
  //   'service' (default): walk each tag's `parent` chain up to the root and
  //     use the kebab-cased root name. Every tag collapses into its owning
  //     backend service (e.g. `Role`, `Permission`, `Role Permission` →
  //     `access`; `Approval Definition`, `Approval Stage`, ... → `approval`;
  //     `GCS`, `S3` → `storage`).
  //
  //   'tag': emit one folder per leaf tag, nested under the parent chain so
  //     related tags stay grouped (e.g. `storage/gcs`, `storage/s3`,
  //     `access/role`, `access/role-permission`). Tags without a parent
  //     become a single-segment path (e.g. `auth`).
  //
  // In both cases the resulting string may contain `/` and is treated as a
  // relative path. Collect operation + service lookups up front so callers
  // can iterate without re-scanning.
  const tagByName = new Map(ir.tags.map((t) => [t.name, t] as const));
  const tagChain = (name: string): string[] => {
    const chain: string[] = [];
    const seen = new Set<string>();
    let current: string | undefined = name;
    while (current && !seen.has(current)) {
      seen.add(current);
      chain.push(current);
      current = tagByName.get(current)?.parent;
    }
    return chain.reverse();
  };
  const domainForTag = (tag: string): string => {
    const chain = tagChain(tag);
    if (chain.length === 0) return SHARED;
    if (target.splitDepth === 'tag') {
      return (
        chain
          .map((segment) => kebabCase(segment))
          .filter(Boolean)
          .join('/') || SHARED
      );
    }
    return kebabCase(chain[0]!) || SHARED;
  };
  const domainOperations = new Map<string, string[]>();
  const domainServices = new Map<string, string[]>();
  const tagToDomain = new Map<string, string>();
  for (const op of ir.operations) {
    const domain = domainForTag(op.tag);
    tagToDomain.set(op.tag, domain);
    const ops = domainOperations.get(domain) ?? [];
    ops.push(op.operationId);
    domainOperations.set(domain, ops);
    const svcs = domainServices.get(domain) ?? [];
    if (!svcs.includes(op.tag)) svcs.push(op.tag);
    domainServices.set(domain, svcs);
  }
  const domains = [...domainOperations.keys()].sort();

  // Model ownership: a model belongs to a domain only if it is exclusively
  // referenced by that domain's operations (directly or transitively).
  const modelDomains = new Map<string, Set<string>>();
  const markModel = (name: string, domain: string) => {
    let set = modelDomains.get(name);
    if (!set) {
      set = new Set();
      modelDomains.set(name, set);
    }
    set.add(domain);
  };
  for (const op of ir.operations) {
    const domain = tagToDomain.get(op.tag) ?? SHARED;
    for (const p of op.params) {
      if (p.rule.ref) markModel(p.rule.ref, domain);
      if (p.rule.itemsRef) markModel(p.rule.itemsRef, domain);
    }
    if (op.bodySchemaRef) markModel(op.bodySchemaRef, domain);
    if (op.successRef) markModel(op.successRef, domain);
  }
  // Transitive closure: a model's nested refs inherit its domain set.
  const schemaByName = new Map(ir.schemas.map((s) => [s.name, s] as const));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, domains] of [...modelDomains]) {
      const schema = schemaByName.get(name);
      if (!schema) continue;
      const refs = new Set<string>();
      if (schema.arrayItemRef) refs.add(schema.arrayItemRef);
      for (const rule of Object.values(schema.properties)) {
        if (rule.ref) refs.add(rule.ref);
        if (rule.itemsRef) refs.add(rule.itemsRef);
      }
      for (const ref of refs) {
        let target = modelDomains.get(ref);
        if (!target) {
          target = new Set();
          modelDomains.set(ref, target);
        }
        for (const d of domains) {
          if (!target.has(d)) {
            target.add(d);
            changed = true;
          }
        }
      }
    }
  }
  const modelOwner = new Map<string, string>();
  for (const schema of ir.schemas) {
    const set = modelDomains.get(schema.name);
    if (!set || set.size !== 1) modelOwner.set(schema.name, SHARED);
    else modelOwner.set(schema.name, [...set][0]!);
  }

  // Build old → new path map.
  const oldToNew = new Map<string, string>();
  const kebabToSchema = new Map(ir.schemas.map((s) => [kebabCase(s.name), s.name] as const));
  for (const file of files) {
    const np = computeNewPath(file.path, {
      modelOwner,
      kebabToSchema,
      tagToDomain,
    });
    if (np) oldToNew.set(file.path, np);
  }

  return { oldToNew, modelOwner, domains, domainOperations, domainServices };
}

interface ComputeCtx {
  modelOwner: Map<string, string>;
  kebabToSchema: Map<string, string>;
  tagToDomain: Map<string, string>;
}

function computeNewPath(oldPath: string, ctx: ComputeCtx): string | undefined {
  // Root-level client primitives → shared/.
  const rootShared = new Set([
    'api-configuration.ts',
    'base-service.ts',
    'request-builder.ts',
    'strict-http-response.ts',
    'api.ts',
    'api.navigation.ts',
    'metadata-types.ts',
  ]);
  if (rootShared.has(oldPath)) return `${SHARED}/${oldPath}`;

  if (oldPath === 'metadata.ts' || oldPath === 'openapi-helpers.ts') {
    return oldPath;
  }

  if (oldPath.startsWith('models/')) {
    const kebab = oldPath.slice('models/'.length).replace(/\.ts$/, '');
    const name = ctx.kebabToSchema.get(kebab);
    const owner = (name && ctx.modelOwner.get(name)) || SHARED;
    return `${owner}/models/${kebab}.ts`;
  }

  if (oldPath.startsWith('fn/')) {
    // fn/<tag-kebab>/<op-kebab>.ts → <domain>/fn/<op-kebab>.ts
    const parts = oldPath.split('/');
    if (parts.length < 3) return undefined;
    const tagKebab = parts[1]!;
    const fileName = parts.slice(2).join('/');
    const domain = findDomainFromKebab(tagKebab, ctx.tagToDomain);
    return `${domain}/fn/${fileName}`;
  }

  if (oldPath.startsWith('services/')) {
    const fileName = oldPath.slice('services/'.length);
    const tagKebab = fileName.replace(/\.service\.ts$/, '');
    const domain = findDomainFromKebab(tagKebab, ctx.tagToDomain);
    return `${domain}/services/${fileName}`;
  }

  if (oldPath === 'permissions/index.ts') return oldPath;
  if (oldPath.startsWith('permissions/')) {
    const fileName = oldPath.slice('permissions/'.length);
    const tagKebab = fileName.replace(/\.ts$/, '');
    const domain = findDomainFromKebab(tagKebab, ctx.tagToDomain);
    return `${domain}/permissions/${fileName}`;
  }

  if (oldPath.startsWith('validators/')) return `${SHARED}/${oldPath}`;

  return undefined;
}

function findDomainFromKebab(tagKebab: string, tagToDomain: Map<string, string>): string {
  for (const [tag, domain] of tagToDomain) {
    if (kebabCase(tag) === tagKebab) return domain;
  }
  return tagKebab || SHARED;
}

function rewriteImports(content: string, oldPath: string, newPath: string, oldToNew: Map<string, string>): string {
  const oldAbs = posix.join(VIRTUAL_ROOT, oldPath);
  const newAbs = posix.join(VIRTUAL_ROOT, newPath);
  const oldDir = dirname(oldAbs);
  const newDir = dirname(newAbs);
  const replaceRelative = (spec: string): string => {
    if (!spec.startsWith('./') && !spec.startsWith('../')) return spec;
    // Resolve target old absolute (append `.ts` candidates).
    const resolved = posix.normalize(posix.join(oldDir, spec));
    const candidates = [`${resolved}.ts`, `${resolved}/index.ts`, resolved];
    for (const cand of candidates) {
      const rel = cand.startsWith(VIRTUAL_ROOT + '/') ? cand.slice(VIRTUAL_ROOT.length + 1) : null;
      if (!rel) continue;
      const np = oldToNew.get(rel);
      if (!np) continue;
      const targetAbs = posix.join(VIRTUAL_ROOT, np);
      let nextSpec = posix.relative(newDir, targetAbs).replace(/\.ts$/, '');
      if (!nextSpec.startsWith('.')) nextSpec = `./${nextSpec}`;
      return nextSpec;
    }
    return spec;
  };
  return content.replace(/(from\s+['"])([^'"]+)(['"])/g, (_m, a, spec, c) => `${a}${replaceRelative(spec)}${c}`);
}

function emitPublicApis(ir: SdkIR, target: ResolvedSdkTarget, mapping: Mapping): VirtualFile[] {
  const out: VirtualFile[] = [];
  const schemaNames = ir.schemas.map((s) => s.name);

  // shared/public-api.ts — shared primitives + shared models only.
  const sharedLines: string[] = [target.banner, ''];
  if (target.features.client) {
    sharedLines.push(`export { ApiConfiguration, provideApiConfiguration } from './api-configuration';`);
    sharedLines.push(`export { BaseService } from './base-service';`);
    sharedLines.push(`export { RequestBuilder } from './request-builder';`);
    sharedLines.push(`export type { StrictHttpResponse } from './strict-http-response';`);
    sharedLines.push(`export { ${target.clientName} } from './api';`);
    sharedLines.push('');
  }
  if (target.features.models) {
    const sharedModels = schemaNames.filter((n) => mapping.modelOwner.get(n) === SHARED);
    for (const name of sharedModels) {
      sharedLines.push(`export type { ${pascalCase(name)} } from './models/${kebabCase(name)}';`);
    }
    if (sharedModels.length) sharedLines.push('');
  }
  if (target.features.metadata) {
    sharedLines.push(`export * from './metadata-types';`);
    sharedLines.push(`export * from './validators/index';`);
    sharedLines.push('');
  }
  if (target.features.navigation) {
    sharedLines.push(`export { ApiNavigation } from './api.navigation';`);
  }
  out.push({ path: `${SHARED}/public-api.ts`, content: finalize(sharedLines.join('\n')) });

  // Per-domain public-api.ts.
  for (const domain of mapping.domains) {
    const lines: string[] = [target.banner, ''];
    // Keep each domain entrypoint scoped to its own surface. Re-exporting the
    // shared barrel here makes the root barrel publish the same names twice
    // once it also exports `./shared/public-api`.
    if (target.features.models) {
      const ownedModels = schemaNames.filter((n) => mapping.modelOwner.get(n) === domain);
      for (const name of ownedModels) {
        lines.push(`export type { ${pascalCase(name)} } from './models/${kebabCase(name)}';`);
      }
      if (ownedModels.length) lines.push('');
    }
    if (target.features.metadata) {
      const tags = (mapping.domainServices.get(domain) ?? []).slice().sort();
      for (const tag of tags) {
        lines.push(`export { ${camelCase(tag)}OperationRules } from './permissions/${kebabCase(tag)}';`);
      }
      if (tags.length) lines.push('');
    }
    if (target.features.services) {
      const tags = mapping.domainServices.get(domain) ?? [];
      for (const tag of tags.sort()) {
        lines.push(`export { ${pascalCase(tag)}Service } from './services/${kebabCase(tag)}.service';`);
      }
      if (tags.length) lines.push('');
    }
    if (target.features.operations) {
      const opIds = (mapping.domainOperations.get(domain) ?? []).slice().sort();
      for (const opId of opIds) {
        const fnName = camelCase(opId);
        const paramsName = `${pascalCase(opId)}$Params`;
        lines.push(`export { ${fnName}, type ${paramsName} } from './fn/${kebabCase(opId)}';`);
      }
    }
    out.push({ path: `${domain}/public-api.ts`, content: finalize(lines.join('\n')) });
  }

  // Root public-api.ts aggregates everything.
  const rootLines: string[] = [target.banner, ''];
  rootLines.push(`export * from './${SHARED}/public-api';`);
  if (target.features.metadata) {
    rootLines.push(`export * from './metadata';`);
    rootLines.push(`export * from './openapi-helpers';`);
  }
  for (const domain of mapping.domains) {
    rootLines.push(`export * from './${domain}/public-api';`);
  }
  out.push({ path: 'public-api.ts', content: finalize(rootLines.join('\n')) });

  return out;
}
