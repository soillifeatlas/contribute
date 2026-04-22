import { describe, it, expect } from 'vitest';
import { marked } from 'marked';
import { listSops } from './sops';

describe('SOP body rendering', () => {
  it('every SOP body renders to non-empty HTML', () => {
    for (const s of listSops()) {
      const html = marked.parse(s.body) as string;
      expect(html).toBeTruthy();
      expect(html.length).toBeGreaterThan(20);
    }
  });
  it('every SOP frontmatter has a file path matching its location', () => {
    for (const s of listSops()) {
      const expected = `sops/${s.category}/${s.slug}.md`;
      expect(s.frontmatter.file).toBe(expected);
    }
  });
});
