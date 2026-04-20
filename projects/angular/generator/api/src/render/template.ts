/**
 * Tiny rendering helpers. We use template literals + small utilities rather
 * than a template engine to keep the generator dependency-free and the
 * emitter output predictable.
 */

/** A virtual file to be written to disk by a writer. */
export interface VirtualFile {
  /** POSIX-style path relative to the target's output directory. */
  path: string;
  content: string;
}

/** kebab-case (preserving digits) — matches the naming style in `old/api/`. */
export function kebabCase(input: string): string {
  return String(input)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** PascalCase — used for class/interface names when sanitizing tags. */
export function pascalCase(input: string): string {
  return String(input)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
}

/** camelCase — used for variable / method / fn names. */
export function camelCase(input: string): string {
  const pc = pascalCase(input);
  return pc ? pc[0].toLowerCase() + pc.slice(1) : '';
}

/** Trim trailing whitespace on every line and ensure a single trailing newline. */
export function finalize(text: string): string {
  const trimmed = text
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\n/, '');
  return trimmed.endsWith('\n') ? trimmed : trimmed + '\n';
}

/** Render an indented block-comment (1-line friendly). */
export function comment(text: string | undefined): string {
  if (!text) return '';
  const safe = text.replace(/\*\//g, '*\\/');
  return `/** ${safe} */`;
}

/** Join non-empty blocks with a blank line between them. */
export function joinBlocks(blocks: readonly (string | undefined | false)[]): string {
  return blocks.filter(Boolean).join('\n\n');
}
