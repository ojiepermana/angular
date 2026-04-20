import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

import type { ComponentStyle, GuideConfig, ResolvedGuideConfig } from './schema';

const VALID_STYLES: readonly ComponentStyle[] = ['none', 'css', 'scss'];

export function loadConfig(configPath: string, workspaceRoot: string): ResolvedGuideConfig {
  const absolute = isAbsolute(configPath) ? configPath : resolve(workspaceRoot, configPath);
  let raw: string;
  try {
    raw = readFileSync(absolute, 'utf8');
  } catch (error) {
    throw new Error(
      `[guide] Unable to read config at ${absolute}. Run \`bun run gen:guide:init\` to scaffold one. (${(error as Error).message})`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`[guide] Invalid JSON in ${absolute}: ${(error as Error).message}`);
  }

  return resolveConfig(parsed as Partial<GuideConfig>, absolute);
}

export function resolveConfig(input: Partial<GuideConfig>, configPath: string): ResolvedGuideConfig {
  if (!input || typeof input !== 'object') {
    throw new Error(`[guide] Config at ${configPath} must be a JSON object.`);
  }
  if (!input.sourceDir || typeof input.sourceDir !== 'string') {
    throw new Error(`[guide] "sourceDir" is required in ${configPath}.`);
  }
  if (!input.outputDir || typeof input.outputDir !== 'string') {
    throw new Error(`[guide] "outputDir" is required in ${configPath}.`);
  }

  const style = input.componentStyle ?? 'none';
  if (!VALID_STYLES.includes(style)) {
    throw new Error(`[guide] Invalid componentStyle "${style}". Expected one of ${VALID_STYLES.join(', ')}.`);
  }

  return {
    sourceDir: input.sourceDir,
    outputDir: input.outputDir,
    routeFile: input.routeFile && input.routeFile.trim() ? input.routeFile : 'doc.routes.ts',
    componentPrefix: input.componentPrefix && input.componentPrefix.trim() ? input.componentPrefix : 'Doc',
    componentStyle: style,
    routeExportName:
      input.routeExportName && /^[A-Za-z_][A-Za-z0-9_]*$/.test(input.routeExportName)
        ? input.routeExportName
        : 'DOC_ROUTES',
  };
}
