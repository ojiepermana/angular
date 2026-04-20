import { relative, resolve } from 'node:path';

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { loadConfig } from '../../src/config/loader';
import { generate, type GenerateResult } from '../../src/engine';

export interface BuildSchematicOptions {
  config?: string;
}

export function build(options: BuildSchematicOptions = {}): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceRoot = process.cwd();
    const configPath = options.config ?? 'config/guide.config.json';
    const config = loadConfig(configPath, workspaceRoot);

    const result = generate(config, workspaceRoot);
    writeResult(tree, workspaceRoot, result, context);
  };
}

function writeResult(tree: Tree, workspaceRoot: string, result: GenerateResult, context: SchematicContext): void {
  const relOutput = relative(workspaceRoot, result.outputDir) || '.';
  context.logger.info(
    `[guide] ${relOutput} (markdown=${result.stats.markdown}, components=${result.stats.components}, files=${result.stats.files})`,
  );

  for (const file of result.files) {
    const treePath = normalizeTreePath(workspaceRoot, file.path);
    const buffer = Buffer.from(file.content, 'utf8');
    if (tree.exists(treePath)) {
      tree.overwrite(treePath, buffer);
    } else {
      tree.create(treePath, buffer);
    }
  }
}

function normalizeTreePath(workspaceRoot: string, path: string): string {
  const abs = resolve(workspaceRoot, path);
  const rel = relative(workspaceRoot, abs);
  const posix = rel.split(/\\+/).join('/');
  return posix.startsWith('/') ? posix : `/${posix}`;
}
