/** Parse a very small subset of YAML frontmatter (string/number/boolean leaves). */
export interface Frontmatter {
  readonly title?: string;
  readonly order?: number;
  readonly description?: string;
  readonly path?: string;
  readonly [key: string]: unknown;
}

export interface ParsedMarkdown {
  readonly frontmatter: Frontmatter;
  readonly body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseMarkdown(source: string): ParsedMarkdown {
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    return { frontmatter: {}, body: source };
  }
  const frontmatter = parseSimpleYaml(match[1]);
  const body = source.slice(match[0].length);
  return { frontmatter, body };
}

function parseSimpleYaml(yaml: string): Frontmatter {
  const out: Record<string, unknown> = {};
  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value: string = line.slice(idx + 1).trim();
    if (!key) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value === 'true') out[key] = true;
    else if (value === 'false') out[key] = false;
    else if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) {
      out[key] = Number(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
