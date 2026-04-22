import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface SopFrontmatter {
  name: string;
  file: string;
  version: string;
  last_updated: string;
  reviewers: string[];
  citation?: string;
  tier: 'T1' | 'T2' | 'shared';
  kingdom_bucket?: string;
  required_fields?: string[];
  taxon_specific_fields?: TaxonField[];
}

export interface TaxonField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'boolean';
  options?: string[];
  required?: boolean;
  hint?: string;
}

export interface Sop {
  slug: string;
  category: 'biomass' | 'extract' | '_shared';
  frontmatter: SopFrontmatter;
  body: string;
}

const SOP_ROOT = path.resolve(process.cwd(), '../sops');

export function listSops(): Sop[] {
  const categories: Array<'biomass' | 'extract' | '_shared'> = ['biomass', 'extract', '_shared'];
  const out: Sop[] = [];
  for (const cat of categories) {
    const dir = path.join(SOP_ROOT, cat);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const parsed = matter(raw);
      out.push({
        slug: file.replace(/\.md$/, ''),
        category: cat,
        frontmatter: parsed.data as SopFrontmatter,
        body: parsed.content
      });
    }
  }
  return out;
}

export function getSop(category: string, slug: string): Sop | null {
  return listSops().find((s) => s.category === category && s.slug === slug) ?? null;
}

export function biomassSopsByKingdom(): Record<string, Sop[]> {
  const groups: Record<string, Sop[]> = {};
  for (const s of listSops().filter((s) => s.category === 'biomass')) {
    const k = s.frontmatter.kingdom_bucket ?? 'Other';
    (groups[k] ||= []).push(s);
  }
  return groups;
}
