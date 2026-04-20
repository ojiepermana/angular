import type { ResolvedSdkTarget } from '../config/schema';
import type { Operation, SdkIR } from '../parser/types';
import { camelCase, finalize, kebabCase, pascalCase, type VirtualFile } from '../render/template';

/**
 * Emit one Injectable service per tag at `services/<tag-kebab>.service.ts`.
 *
 * Each method returns `Observable<T>` (body-only) plus a `<method>$Response`
 * variant that returns the full `StrictHttpResponse<T>`. Bodies are dispatched
 * through the tree-shakeable fn modules emitted by {@link emitOperations}, so
 * unused methods can be shaken out.
 */
export function emitServices(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const byTag = groupByTag(ir.operations);
  const files: VirtualFile[] = [];
  for (const [tag, ops] of byTag) {
    files.push({
      path: `services/${kebabCase(tag)}.service.ts`,
      content: finalize(renderService(tag, ops, target)),
    });
  }
  return files;
}

function groupByTag(operations: readonly Operation[]): Map<string, Operation[]> {
  const map = new Map<string, Operation[]>();
  for (const op of operations) {
    const bucket = map.get(op.tag) ?? [];
    bucket.push(op);
    map.set(op.tag, bucket);
  }
  return map;
}

function renderService(tag: string, ops: readonly Operation[], target: ResolvedSdkTarget): string {
  const className = `${pascalCase(tag)}Service`;
  const sorted = [...ops].sort((a, b) => a.operationId.localeCompare(b.operationId));

  const fnImports: string[] = [];
  const modelImports = new Set<string>();
  for (const op of sorted) {
    const fnName = camelCase(op.operationId);
    const paramsName = `${pascalCase(op.operationId)}$Params`;
    fnImports.push(
      `import { ${fnName}, type ${paramsName} } from '../fn/${kebabCase(tag)}/${kebabCase(op.operationId)}';`,
    );
    if (op.successRef) modelImports.add(op.successRef);
  }
  const modelImportLines = [...modelImports]
    .sort()
    .map((ref) => `import type { ${pascalCase(ref)} } from '../models/${kebabCase(ref)}';`);

  const methods = sorted.map((op) => renderMethod(op)).join('\n\n');

  return `${target.banner}

import { HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { StrictHttpResponse } from '../strict-http-response';

${fnImports.join('\n')}
${modelImportLines.length ? '\n' + modelImportLines.join('\n') : ''}

@Injectable({ providedIn: 'root' })
export class ${className} extends BaseService {
${methods}
}
`;
}

function renderMethod(op: Operation): string {
  const fnName = camelCase(op.operationId);
  const paramsName = `${pascalCase(op.operationId)}$Params`;
  const responseType = op.successRef ? pascalCase(op.successRef) : 'unknown';

  const hasParams = op.params.length > 0 || Boolean(op.bodySchemaRef);
  const anyRequired = op.params.some((p) => p.required) || (op.bodySchemaRef != null && op.bodyRequired);
  const paramsSig = hasParams ? `params${anyRequired ? '' : '?'}: ${paramsName}` : `params?: ${paramsName}`;

  return `  /** ${op.summary ?? op.operationId} (${op.method.toUpperCase()} ${op.path}) */
  ${fnName}$Response(${paramsSig}, context?: HttpContext): Observable<StrictHttpResponse<${responseType}>> {
    return ${fnName}(this.http, this.rootUrl, params as ${paramsName}, context).pipe(
      filter((r: unknown): r is HttpResponse<unknown> => r instanceof HttpResponse),
      map((r) => r as StrictHttpResponse<${responseType}>),
    );
  }

  /** ${op.summary ?? op.operationId} (${op.method.toUpperCase()} ${op.path}) */
  ${fnName}(${paramsSig}, context?: HttpContext): Observable<${responseType}> {
    return this.${fnName}$Response(params as ${paramsName}, context).pipe(map((r) => r.body));
  }`;
}
