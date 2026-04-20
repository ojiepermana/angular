import { readFileSync, existsSync } from 'node:fs';
import { extname, isAbsolute, resolve } from 'node:path';

import { resolveConfig, type ResolvedSdkTarget } from './schema';

/**
 * Loads an SDK generator config from disk. Supports `.json` and `.js`/`.cjs`
 * (require-based). `.ts` is intentionally not supported in the first iteration
 * to avoid pulling an extra compile step — use `.json` or `.js` instead.
 */
export function loadConfig(configPath: string, workspaceRoot: string): ResolvedSdkTarget[] {
  const absolute = isAbsolute(configPath) ? configPath : resolve(workspaceRoot, configPath);
  if (!existsSync(absolute)) {
    throw new Error(`SDK config not found at ${absolute}`);
  }

  const ext = extname(absolute).toLowerCase();
  let raw: unknown;
  if (ext === '.json' || ext === '') {
    const text = readFileSync(absolute, 'utf8');
    raw = JSON.parse(stripJsonComments(text));
  } else if (ext === '.js' || ext === '.cjs') {
    const mod: unknown = require(absolute);
    raw = extractDefaultExport(mod);
  } else {
    throw new Error(`Unsupported SDK config extension: ${ext} (use .json or .js)`);
  }

  return resolveConfig(raw);
}

function extractDefaultExport(mod: unknown): unknown {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return (mod as { default: unknown }).default;
  }
  return mod;
}

function stripJsonComments(text: string): string {
  // Minimal JSONC support: strip // line comments and /* */ block comments.
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}
