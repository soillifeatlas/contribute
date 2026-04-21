import { describe, it, expect } from 'vitest';
import { listSops, biomassSopsByKingdom } from './sops';

describe('sops loader', () => {
  it('loads all 25 SOPs (4 shared + 17 biomass + 4 extract)', () => {
    const all = listSops();
    expect(all.length).toBe(25);
  });
  it('groups biomass SOPs by kingdom bucket', () => {
    const groups = biomassSopsByKingdom();
    expect(Object.keys(groups)).toEqual(expect.arrayContaining([
      'Bacteria', 'Archaea', 'Fungi', 'Algae', 'Protists', 'Plantae', 'Animalia', 'Nucleocytoviricota'
    ]));
    expect(groups['Animalia']?.length).toBe(5);
    expect(groups['Fungi']?.length).toBe(3);
  });
  it('every SOP has required frontmatter fields', () => {
    for (const s of listSops()) {
      expect(s.frontmatter.name).toBeTruthy();
      expect(s.frontmatter.version).toMatch(/^\d+\.\d+$/);
      expect(s.frontmatter.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
