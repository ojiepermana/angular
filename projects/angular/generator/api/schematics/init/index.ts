import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export interface InitSchematicOptions {
  /** Destination path for the generated config, relative to the workspace root. */
  path?: string;
  /** Overwrite an existing file at that path. */
  force?: boolean;
}

/**
 * Default config template. The published package also ships a concrete
 * `sdk.config.example.json`; this fallback only exists so `init` still works if
 * the file is missing in unusual local/dev states.
 */
const FALLBACK_TEMPLATE = {
  $schema: './node_modules/@ojiepermana/angular/generator/api/schematics/sdk/schema.json',
  targets: [
    {
      input: './openapi.yaml',
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

    context.logger.info(
      `[sdk:init] edit targets[].input and targets[].output, then run \`${getNextCommand(workspaceRoot)}\`.`,
    );
  };
}

function loadTemplate(workspaceRoot: string): string {
  const candidates = [
    resolve(workspaceRoot, 'sdk.config.example.json'),
    resolve(__dirname, '../../../sdk.config.example.json'),
    resolve(workspaceRoot, 'projects/angular/generator/api/sdk.config.example.json'),
  ];
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(readFileSync(candidate, 'utf8')) as Record<string, unknown>;
      parsed.$schema = resolveSchemaPath(workspaceRoot);
      return `${JSON.stringify(parsed, null, 2)}\n`;
    } catch {
      // try next
    }
  }
  return `${JSON.stringify({ ...FALLBACK_TEMPLATE, $schema: resolveSchemaPath(workspaceRoot) }, null, 2)}\n`;
}

function resolveSchemaPath(workspaceRoot: string): string {
  if (existsSync(resolve(workspaceRoot, 'projects/angular/generator/api/schematics/sdk/schema.json'))) {
    return './projects/angular/generator/api/schematics/sdk/schema.json';
  }
  return './node_modules/@ojiepermana/angular/generator/api/schematics/sdk/schema.json';
}

function getNextCommand(workspaceRoot: string): string {
  if (existsSync(resolve(workspaceRoot, 'projects/angular/generator/api/collection.json'))) {
    return 'bun run gen:sdk';
  }
  return 'ng generate @ojiepermana/angular/generator/api:sdk';
}
