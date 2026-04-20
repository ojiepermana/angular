import type { ResolvedSdkTarget } from '../config/schema';
import type { Operation, OperationParam, SdkIR } from '../parser/types';
import { camelCase, finalize, kebabCase, pascalCase, type VirtualFile } from '../render/template';
import { renderFieldType } from './models';

/**
 * Emit one tree-shakeable operation function per operationId at
 * `fn/<tag-kebab>/<operation-kebab>.ts`.
 *
 * Each file exports:
 *   - `<operationId>$Params` interface
 *   - `<operationId>` function returning `Observable<StrictHttpResponse<R>>`
 *   - `<operationId>.PATH` constant
 */
export function emitOperations(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  return ir.operations.map((op) => ({
    path: `fn/${kebabCase(op.tag)}/${kebabCase(op.operationId)}.ts`,
    content: finalize(renderOperation(op, target)),
  }));
}

function renderOperation(op: Operation, target: ResolvedSdkTarget): string {
  const fnName = camelCase(op.operationId);
  const paramsName = `${pascalCase(op.operationId)}$Params`;
  const responseType = op.successRef ? pascalCase(op.successRef) : 'unknown';

  const paramImports = collectParamImports(op);
  const imports: string[] = [
    `import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';`,
    `import { Observable } from 'rxjs';`,
    `import { filter, map } from 'rxjs/operators';`,
    ``,
    `import { RequestBuilder } from '../../request-builder';`,
    `import { StrictHttpResponse } from '../../strict-http-response';`,
  ];
  for (const name of paramImports) {
    imports.push(`import type { ${pascalCase(name)} } from '../../models/${kebabCase(name)}';`);
  }

  const paramsInterface = renderParamsInterface(op, paramsName);
  const hasAnyParams = paramsInterface.hasAnyField;
  const paramsOptional = !paramsInterface.anyRequired;

  const bodyCT = op.bodySchemaRef ? "'application/json'" : '';
  const pathCalls = op.params
    .filter((p) => p.in === 'path')
    .map((p) => `    rb.path('${p.name}', params.${safeProp(p.name)});`);
  const queryCalls = op.params
    .filter((p) => p.in === 'query')
    .map((p) => `    rb.query('${p.name}', params.${safeProp(p.name)});`);
  const headerCalls = op.params
    .filter((p) => p.in === 'header')
    .map((p) => `    rb.header('${p.name}', params.${safeProp(p.name)});`);
  const bodyCall = op.bodySchemaRef ? `    rb.body(params.body, ${bodyCT});` : '';

  const populate =
    pathCalls.length || queryCalls.length || headerCalls.length || bodyCall
      ? `  if (params) {
${[...pathCalls, ...queryCalls, ...headerCalls, bodyCall].filter(Boolean).join('\n')}
  }`
      : '';

  const paramsArg = hasAnyParams
    ? `params${paramsOptional ? '?' : ''}: ${paramsName}`
    : `_params?: Record<string, never>`;

  return `${target.banner}

${imports.join('\n')}

${paramsInterface.source}
export function ${fnName}(
  http: HttpClient,
  rootUrl: string,
  ${paramsArg},
  context?: HttpContext,
): Observable<StrictHttpResponse<${responseType}>> {
  const rb = new RequestBuilder(rootUrl, ${fnName}.PATH, '${op.method}');
${populate}
  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: unknown): r is HttpResponse<unknown> => r instanceof HttpResponse),
    map((r) => r as StrictHttpResponse<${responseType}>),
  );
}

${fnName}.PATH = '${op.path}';
`;
}

function collectParamImports(op: Operation): string[] {
  const set = new Set<string>();
  for (const p of op.params) {
    if (p.rule.ref) set.add(p.rule.ref);
    if (p.rule.itemsRef) set.add(p.rule.itemsRef);
  }
  if (op.bodySchemaRef) set.add(op.bodySchemaRef);
  if (op.successRef) set.add(op.successRef);
  return [...set].sort();
}

function renderParamsInterface(
  op: Operation,
  paramsName: string,
): { source: string; hasAnyField: boolean; anyRequired: boolean } {
  const lines: string[] = [];
  let anyRequired = false;
  const pushField = (p: OperationParam) => {
    const optional = p.required ? '' : '?';
    if (p.required) anyRequired = true;
    const type = renderFieldType(p.rule);
    const name = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(p.name) ? p.name : `'${p.name}'`;
    lines.push(`  ${name}${optional}: ${type};`);
  };

  for (const p of op.params) pushField(p);
  if (op.bodySchemaRef) {
    const optional = op.bodyRequired ? '' : '?';
    if (op.bodyRequired) anyRequired = true;
    lines.push(`  body${optional}: ${pascalCase(op.bodySchemaRef)};`);
  }

  const hasAnyField = lines.length > 0;
  const source = hasAnyField
    ? `export interface ${paramsName} {\n${lines.join('\n')}\n}\n`
    : `export type ${paramsName} = Record<string, never>;\n`;
  return { source, hasAnyField, anyRequired };
}

function safeProp(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : `['${name}']`;
}
