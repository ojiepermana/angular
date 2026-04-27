import { relative, resolve } from 'node:path';

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { loadConfig } from '../../src/config/loader';
import type { ResolvedSdkTarget } from '../../src/config/schema';
import { generate, type GenerateResult } from '../../src/engine';

export interface SdkSchematicOptions {
  /** Path to the sdk config file. Resolved relative to the workspace root. */
  config?: string;
  /**
   * Optional selector to generate only one target. Accepts either a
   * 1-based index (string) or — if configs ever grow named targets — a name
   * match on the `output` path.
   */
  target?: string;
}

/**
 * Schematic factory. Reads `sdk.config.json` at the workspace root, runs the
 * pure generator, and writes each emitted file into the Tree so
 * `--dry-run` / `--force` behave as expected.
 */
export function sdk(options: SdkSchematicOptions = {}): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspaceRoot = process.cwd();
    const configPath = options.config ?? 'config/sdk.config.json';
    const targets = loadConfig(configPath, workspaceRoot);

    const selected = selectTargets(targets, options.target);
    if (selected.length === 0) {
      throw new Error(`No SDK targets matched "${options.target}"`);
    }

    for (const target of selected) {
      const result = await generate(target, workspaceRoot);
      writeResult(tree, workspaceRoot, result, context);
    }
  };
}

function selectTargets(targets: readonly ResolvedSdkTarget[], selector: string | undefined): ResolvedSdkTarget[] {
  if (!selector) return [...targets];

  const idx = Number.parseInt(selector, 10);
  if (!Number.isNaN(idx) && idx > 0 && idx <= targets.length) {
    return [targets[idx - 1]];
  }

  const lc = selector.toLowerCase();
  return targets.filter(
    (t) =>
      t.clientName.toLowerCase() === lc || t.output.toLowerCase().includes(lc) || t.packageName.toLowerCase() === lc,
  );
}

export function writeResult(
  tree: Tree,
  workspaceRoot: string,
  result: GenerateResult,
  context: SchematicContext,
): void {
  const relOutput = relative(workspaceRoot, result.outputDir) || '.';
  context.logger.info(
    `[sdk] ${result.target.mode} → ${relOutput} ` +
      `(schemas=${result.stats.schemas}, operations=${result.stats.operations}, ` +
      `tags=${result.stats.tags}, files=${result.stats.files})`,
  );

  removeStaleFiles(tree, workspaceRoot, result);

  for (const file of result.files) {
    const absolute = resolve(result.outputDir, file.path);
    const treePath = normalizeTreePath(workspaceRoot, absolute);
    const buffer = Buffer.from(file.content, 'utf8');
    if (tree.exists(treePath)) {
      tree.overwrite(treePath, buffer);
    } else {
      tree.create(treePath, buffer);
    }
  }
}

function removeStaleFiles(tree: Tree, workspaceRoot: string, result: GenerateResult): void {
  const outputRoot = normalizeTreePath(workspaceRoot, result.outputDir);
  if (outputRoot === '/') {
    return;
  }

  const nextFiles = new Set(
    result.files.map((file) => normalizeTreePath(workspaceRoot, resolve(result.outputDir, file.path))),
  );
  const staleFiles: string[] = [];

  tree.getDir(outputRoot).visit((path) => {
    if (!nextFiles.has(path)) {
      staleFiles.push(path);
    }
  });

  for (const staleFile of staleFiles) {
    tree.delete(staleFile);
  }
}

function normalizeTreePath(workspaceRoot: string, absolute: string): string {
  const rel = relative(workspaceRoot, absolute);
  const posix = rel.split(/\\+/).join('/');
  return posix.startsWith('/') ? posix : `/${posix}`;
}
