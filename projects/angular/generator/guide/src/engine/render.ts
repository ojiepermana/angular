import { marked } from 'marked';

/** Render Markdown (GFM) to HTML synchronously. */
export function renderMarkdown(body: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  const html = marked.parse(body, { async: false });
  if (typeof html !== 'string') {
    throw new Error('[guide] marked returned a non-string result; expected synchronous parse.');
  }
  return html.trim();
}

/** Escape backticks and `${` so HTML can be safely embedded in a TS template literal. */
export function escapeForTemplateLiteral(html: string): string {
  return html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
