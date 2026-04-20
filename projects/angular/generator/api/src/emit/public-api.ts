import type { ResolvedSdkTarget } from '../config/schema';
import type { Operation, SdkIR } from '../parser/types';
import { camelCase, finalize, kebabCase, pascalCase, type VirtualFile } from '../render/template';

/**
 * Emit `public-api.ts` — the barrel that re-exports every generated artifact
 * based on the resolved feature flags. Mirrors the convention used by the
 * reference output in `old/api/index.ts`.
 */
export function emitPublicApi(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const lines: string[] = [target.banner, ''];

  if (target.features.client) {
    lines.push(`export { ApiConfiguration, provideApiConfiguration } from './api-configuration';`);
    lines.push(`export { BaseService } from './base-service';`);
    lines.push(`export { RequestBuilder } from './request-builder';`);
    lines.push(`export type { StrictHttpResponse } from './strict-http-response';`);
    lines.push(`export { ${target.clientName} } from './api';`);
    lines.push('');
  }

  if (target.features.models) {
    for (const schema of ir.schemas) {
      lines.push(`export type { ${pascalCase(schema.name)} } from './models/${kebabCase(schema.name)}';`);
    }
    lines.push('');
  }

  if (target.features.services) {
    const tags = Array.from(new Set(ir.operations.map((o) => o.tag))).sort();
    for (const tag of tags) {
      lines.push(`export { ${pascalCase(tag)}Service } from './services/${kebabCase(tag)}.service';`);
    }
    lines.push('');
  }

  if (target.features.operations) {
    const sorted = [...ir.operations].sort((a, b) => a.operationId.localeCompare(b.operationId));
    for (const op of sorted) {
      lines.push(renderFnReexport(op));
    }
    lines.push('');
  }

  if (target.features.metadata) {
    lines.push(`export * from './metadata';`);
    lines.push(`export * from './openapi-helpers';`);
    lines.push('');
  }

  if (target.features.navigation) {
    lines.push(`export { apiNavigation } from './navigation';`);
    lines.push(`export type { ApiNavigationNode } from './navigation';`);
  }

  return [{ path: 'public-api.ts', content: finalize(lines.join('\n')) }];
}

function renderFnReexport(op: Operation): string {
  const fnName = camelCase(op.operationId);
  const paramsName = `${pascalCase(op.operationId)}$Params`;
  return `export { ${fnName}, type ${paramsName} } from './fn/${kebabCase(op.tag)}/${kebabCase(op.operationId)}';`;
}
