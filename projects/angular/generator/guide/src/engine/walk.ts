import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface SourceFile {
  /** Absolute path to the source markdown file. */
  readonly absolutePath: string;
  /** Path relative to the sourceDir, using forward slashes. e.g. `intro/overview.md`. */
  readonly relativePath: string;
  /** Parsed segments (no extension), e.g. `['intro', 'overview']`. */
  readonly segments: readonly string[];
  /** Raw file contents. */
  readonly content: string;
}

export function collectMarkdown(sourceDir: string): SourceFile[] {
  const out: SourceFile[] = [];
  walk(sourceDir, sourceDir, out);
  return out.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function walk(root: string, dir: string, out: SourceFile[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(root, abs, out);
      continue;
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue;
    const st = statSync(abs);
    if (!st.isFile()) continue;
    const rel = relative(root, abs)
      .split(/[\\/]+/)
      .join('/');
    const segments = rel.replace(/\.md$/i, '').split('/');
    out.push({
      absolutePath: abs,
      relativePath: rel,
      segments,
      content: readFileSync(abs, 'utf8'),
    });
  }
}
