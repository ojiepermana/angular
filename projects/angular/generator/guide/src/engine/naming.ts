export function toSlug(segment: string): string {
  return segment
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toPascal(segment: string): string {
  return segment
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

export function componentClassName(prefix: string, segments: readonly string[]): string {
  const base = segments.map(toPascal).join('');
  return `${prefix}${base}Component`;
}

export function componentFileBase(segments: readonly string[]): string {
  const last = segments[segments.length - 1] ?? 'index';
  return toSlug(last) || 'index';
}

export function componentSelector(prefix: string, segments: readonly string[]): string {
  const kebabPrefix =
    prefix
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'doc';
  const rest = segments.map(toSlug).filter(Boolean).join('-') || 'index';
  return `${kebabPrefix}-${rest}`;
}
