import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

import YAML from 'yaml';

/**
 * Load an OpenAPI spec from disk. We deliberately do NOT run Swagger Parser's
 * strict validator here because it rejects OpenAPI 3.2.x, while the rest of
 * the pipeline only needs structural access to `components` + `paths` (which
 * is version-stable across 3.x). Specs that rely on external `$ref`s should
 * be bundled first with a separate tool.
 *
 * Accepts `.yaml`/`.yml`/`.json`.
 */
export async function loadSpec(path: string): Promise<any> {
  const text = readFileSync(path, 'utf8');
  const ext = extname(path).toLowerCase();
  if (ext === '.json') return JSON.parse(text);
  return YAML.parse(text);
}
