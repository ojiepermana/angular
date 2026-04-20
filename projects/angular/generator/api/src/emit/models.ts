import type { ResolvedSdkTarget } from '../config/schema';
import type { FieldRule, ModelSchema, SdkIR } from '../parser/types';
import { finalize, kebabCase, pascalCase, type VirtualFile } from '../render/template';

/**
 * Emit one `interface` per schema into `models/<kebab>.ts` — type-only, no
 * runtime footprint.
 */
export function emitModels(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const files: VirtualFile[] = [];
  for (const schema of ir.schemas) {
    const fileName = `${kebabCase(schema.name)}.ts`;
    files.push({
      path: `models/${fileName}`,
      content: finalize(renderModel(schema, ir, target)),
    });
  }
  return files;
}

function renderModel(schema: ModelSchema, ir: SdkIR, target: ResolvedSdkTarget): string {
  const imports = collectModelImports(schema).filter((name) => name !== schema.name);
  const importLines = imports.map((name) => `import type { ${name} } from './${kebabCase(name)}';`);

  let body = '';
  if (schema.enumValues) {
    // Primitive enum alias.
    body = `export type ${pascalCase(schema.name)} = ${schema.enumValues
      .map((v) => (typeof v === 'string' ? `'${escapeSingle(v)}'` : String(v)))
      .join(' | ')};`;
  } else if (schema.arrayItemRef || schema.arrayItemType) {
    const itemType = schema.arrayItemRef ? pascalCase(schema.arrayItemRef) : tsPrimitive(schema.arrayItemType);
    body = `export type ${pascalCase(schema.name)} = ${itemType}[];`;
  } else {
    body = renderInterface(schema);
  }

  return [target.banner, '', ...importLines, importLines.length ? '' : '', body].join('\n');
}

function renderInterface(schema: ModelSchema): string {
  const lines: string[] = [];
  lines.push(`export interface ${pascalCase(schema.name)} {`);
  for (const [propName, rule] of Object.entries(schema.properties)) {
    const optional = rule.required ? '' : '?';
    const type = renderFieldType(rule);
    const safeName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(propName) ? propName : `'${propName}'`;
    lines.push(`  ${safeName}${optional}: ${type};`);
  }
  lines.push(`}`);
  return lines.join('\n');
}

export function renderFieldType(rule: FieldRule): string {
  let base: string;
  if (rule.ref) {
    base = pascalCase(rule.ref);
  } else if (rule.type === 'array') {
    const item = rule.itemsRef
      ? pascalCase(rule.itemsRef)
      : rule.enumValues
        ? rule.enumValues.map((v) => (typeof v === 'string' ? `'${escapeSingle(v)}'` : String(v))).join(' | ')
        : tsPrimitive(rule.itemsType);
    base = rule.enumValues && !rule.itemsRef ? `(${item})[]` : `${item}[]`;
  } else if (rule.enumValues && rule.enumValues.length > 0) {
    base = rule.enumValues.map((v) => (typeof v === 'string' ? `'${escapeSingle(v)}'` : String(v))).join(' | ');
  } else {
    base = tsPrimitive(rule.type);
  }
  return rule.nullable ? `${base} | null` : base;
}

function tsPrimitive(type: string | undefined): string {
  switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'unknown[]';
    case 'object':
      return 'Record<string, unknown>';
    case undefined:
    case 'unknown':
    default:
      return 'unknown';
  }
}

function escapeSingle(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function collectModelImports(schema: ModelSchema): string[] {
  const set = new Set<string>();
  if (schema.arrayItemRef) set.add(schema.arrayItemRef);
  for (const rule of Object.values(schema.properties)) {
    if (rule.ref) set.add(rule.ref);
    if (rule.itemsRef) set.add(rule.itemsRef);
  }
  return [...set].sort();
}
