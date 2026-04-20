import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export interface InitSchematicOptions {
  /** Destination path for the generated config, relative to the workspace root. */
  path?: string;
  /** Overwrite an existing file at that path. */
  force?: boolean;
}

/**
 * Default config template. Inlined so the schematic works even when the
 * workspace has no example file committed. If a real `sdk.config.example.json`
 * sits next to the generator package, we prefer that so edits to the example
 * propagate automatically.
 */
const FALLBACK_TEMPLATE = {
  $schema: './projects/angular/generator/api/schematics/sdk/schema.json',
  targets: [
    {
      input: './projects/angular/generator/api/openapi.bundle.yaml',
      output: './sdk',
      mode: 'standalone',
      clientName: 'Api',
      rootUrl: 'http://127.0.0.1:8080',
      features: {
        models: true,
        operations: true,
        services: true,
        client: true,
        metadata: true,
        navigation: true,
      },
    },
  ],
};

export function init(options: InitSchematicOptions = {}): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceRoot = process.cwd();
    const destRelative = options.path ?? 'sdk.config.json';
    const treePath = destRelative.startsWith('/') ? destRelative : `/${destRelative}`;

    if (tree.exists(treePath) && !options.force) {
      throw new Error(`${destRelative} already exists. Re-run with --force to overwrite.`);
    }

    const content = loadTemplate(workspaceRoot);
    const buffer = Buffer.from(content, 'utf8');

    if (tree.exists(treePath)) {
      tree.overwrite(treePath, buffer);
      context.logger.info(`[sdk:init] overwrote ${destRelative}`);
    } else {
      tree.create(treePath, buffer);
      context.logger.info(`[sdk:init] created ${destRelative}`);
    }

    context.logger.info(`[sdk:init] edit targets[].input and targets[].output, then run \`bun run gen:sdk\`.`);
  };
}

function loadTemplate(workspaceRoot: string): string {
  // Prefer the example shipped at workspace root so it stays in sync.
  const candidates = [
    resolve(workspaceRoot, 'sdk.config.example.json'),
    resolve(workspaceRoot, 'projects/angular/generator/api/sdk.config.example.json'),
  ];
  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, 'utf8');
    } catch {
      // try next
    }
  }
  return JSON.stringify(FALLBACK_TEMPLATE, null, 2) + '\n';
}
