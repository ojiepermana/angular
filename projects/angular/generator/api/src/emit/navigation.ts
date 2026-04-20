import type { ResolvedSdkTarget } from '../config/schema';
import type { NavNode, SdkIR } from '../parser/types';
import { finalize, kebabCase, type VirtualFile } from '../render/template';

/**
 * Emit `api.navigation.ts` exporting `NavigationItem[]` data that plugs
 * directly into `NavigationService.registerItems(...)` from
 * `@ojiepermana/angular/navigation`.
 */
export function emitNavigation(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  return [
    {
      path: 'api.navigation.ts',
      content: finalize(renderNavigation(ir.navigation, target)),
    },
  ];
}

function renderNavigation(nodes: readonly NavNode[], target: ResolvedSdkTarget): string {
  return `${target.banner}

import type { NavigationItem } from '@ojiepermana/angular/navigation';

export const ApiNavigation: NavigationItem[] = ${stringifyNodes(nodes, 0, [])};
`;
}

function stringifyNodes(nodes: readonly NavNode[], depth: number, lineage: readonly string[]): string {
  if (!nodes.length) return '[]';
  const pad = '  '.repeat(depth + 1);
  const closePad = '  '.repeat(depth);
  return `[\n${nodes
    .map((node) => pad + stringifyNode(node, depth + 1, [...lineage, node.name]))
    .join(',\n')},\n${closePad}]`;
}

function stringifyNode(node: NavNode, depth: number, lineage: readonly string[]): string {
  const hasChildren = node.children.length > 0;
  const pad = '  '.repeat(depth + 1);
  const closePad = '  '.repeat(depth);
  const fields: string[] = [
    `${pad}id: ${JSON.stringify(lineage.map(kebabCase).filter(Boolean).join('-'))}`,
    `${pad}title: ${JSON.stringify(node.name)}`,
    `${pad}type: ${JSON.stringify(resolveItemType(lineage.length - 1, hasChildren))}`,
  ];
  if (node.description) fields.push(`${pad}subtitle: ${JSON.stringify(node.description)}`);
  if (node.xIcon) fields.push(`${pad}icon: ${JSON.stringify(node.xIcon)}`);
  if (hasChildren) fields.push(`${pad}children: ${stringifyNodes(node.children, depth + 1, lineage)}`);
  return `{\n${fields.join(',\n')},\n${closePad}}`;
}

function resolveItemType(depth: number, hasChildren: boolean): 'group' | 'collapsable' | 'basic' {
  if (!hasChildren) return 'basic';
  return depth === 0 ? 'group' : 'collapsable';
}
