import { describe, it, expect } from 'vitest';
import { buildNavLinks } from './nav-links';

describe('buildNavLinks', () => {
  it('respects base path', () => {
    const links = buildNavLinks('/contribute');
    expect(links.find((l) => l.id === 'sops')?.href).toBe('/contribute/sops/');
    expect(links.find((l) => l.id === 'submit')?.href).toBe('/contribute/submit/');
  });
  it('marks external links correctly', () => {
    const links = buildNavLinks('/contribute');
    expect(links.find((l) => l.id === 'github')?.external).toBe(true);
    expect(links.find((l) => l.id === 'sops')?.external).toBe(false);
  });
  it('handles trailing slash in base', () => {
    const links = buildNavLinks('/contribute/');
    expect(links.find((l) => l.id === 'schema')?.href).toBe('/contribute/schema/');
  });
});
