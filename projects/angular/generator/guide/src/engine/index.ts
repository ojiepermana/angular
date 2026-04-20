import { isAbsolute, resolve } from 'node:path';

import type { ResolvedGuideConfig } from '../config/schema';
import { buildComponent, type GeneratedComponent } from './component';
import { parseMarkdown } from './frontmatter';
import { renderRoutes } from './routes';
import { collectMarkdown } from './walk';

export interface EmittedFile {
  /** Path relative to the workspace root. */
  readonly path: string;
  /** UTF-8 file contents. */
  readonly content: string;
}

export interface GenerateResult {
  readonly config: ResolvedGuideConfig;
  readonly outputDir: string;
  readonly files: readonly EmittedFile[];
  readonly stats: { readonly markdown: number; readonly components: number; readonly files: number };
}

export function generate(config: ResolvedGuideConfig, workspaceRoot: string): GenerateResult {
  const sourceAbs = resolveUnderRoot(config.sourceDir, workspaceRoot);
  const outputAbs = resolveUnderRoot(config.outputDir, workspaceRoot);

  const sources = collectMarkdown(sourceAbs);
  const components: GeneratedComponent[] = sources.map((src) => {
    const { frontmatter, body } = parseMarkdown(src.content);
    return buildComponent(src.segments, frontmatter, body, config);
  });

  const files: EmittedFile[] = [];
  for (const comp of components) {
    files.push({ path: joinWorkspace(workspaceRoot, outputAbs, comp.tsPath), content: comp.tsContent });
    if (comp.stylePath && comp.styleContent !== null) {
      files.push({ path: joinWorkspace(workspaceRoot, outputAbs, comp.stylePath), content: comp.styleContent });
    }
  }
  files.push({
    path: joinWorkspace(workspaceRoot, outputAbs, config.routeFile),
    content: renderRoutes(components, config),
  });

  return {
    config,
    outputDir: outputAbs,
    files,
    stats: { markdown: sources.length, components: components.length, files: files.length },
  };
}

function resolveUnderRoot(p: string, workspaceRoot: string): string {
  return isAbsolute(p) ? p : resolve(workspaceRoot, p);
}

function joinWorkspace(workspaceRoot: string, outputAbs: string, rel: string): string {
  const abs = resolve(outputAbs, rel);
  const normalized = abs.startsWith(workspaceRoot) ? abs.slice(workspaceRoot.length + 1) : abs;
  return normalized.split(/[\\/]+/).join('/');
}
