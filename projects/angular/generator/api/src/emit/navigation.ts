import type { ResolvedSdkTarget } from '../config/schema';
import type { NavNode, SdkIR } from '../parser/types';
import { finalize, type VirtualFile } from '../render/template';

/**
 * Emit a flat `navigation.ts` exporting the tag-derived tree from the spec
 * (`x-icon`, `parent` relations). Consumers use this to build side-nav menus
 * that stay in sync with the API docs.
 */
export function emitNavigation(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  return [
    {
      path: 'navigation.ts',
      content: finalize(renderNavigation(ir.navigation, target)),
    },
  ];
}

function renderNavigation(nodes: readonly NavNode[], target: ResolvedSdkTarget): string {
  return `${target.banner}

export interface ApiNavigationNode {
  name: string;
  xIcon?: string;
  description?: string;
  children: ApiNavigationNode[];
}

export const apiNavigation: readonly ApiNavigationNode[] = ${stringifyNodes(nodes, 0)};
`;
}

function stringifyNodes(nodes: readonly NavNode[], depth: number): string {
  if (!nodes.length) return '[]';
  const pad = '  '.repeat(depth + 1);
  const closePad = '  '.repeat(depth);
  return `[\n${nodes.map((n) => pad + stringifyNode(n, depth + 1)).join(',\n')},\n${closePad}]`;
}

function stringifyNode(node: NavNode, depth: number): string {
  const pad = '  '.repeat(depth + 1);
  const closePad = '  '.repeat(depth);
  const fields: string[] = [`${pad}name: ${JSON.stringify(node.name)}`];
  if (node.xIcon) fields.push(`${pad}xIcon: ${JSON.stringify(node.xIcon)}`);
  if (node.description) fields.push(`${pad}description: ${JSON.stringify(node.description)}`);
  fields.push(`${pad}children: ${stringifyNodes(node.children, depth + 1)}`);
  return `{\n${fields.join(',\n')},\n${closePad}}`;
}
