import fs from 'node:fs';
import path from 'node:path';

const today = '2026-04-21';
const reviewers = '[rahul.samrat@univie.ac.at]';

const biomass = [
  ['bacteria', 'Bacteria', 'Bacteria'],
  ['archaea', 'Archaea', 'Archaea'],
  ['fungi-filamentous', 'Fungi (filamentous)', 'Fungi'],
  ['fungi-yeast', 'Fungi (yeast)', 'Fungi'],
  ['fungi-amf', 'Arbuscular mycorrhizal fungi', 'Fungi'],
  ['algae-microalgae', 'Microalgae', 'Algae'],
  ['algae-macroalgae', 'Macroalgae', 'Algae'],
  ['protists-axenic', 'Protists (axenic cultures)', 'Protists'],
  ['protists-environmental', 'Protists (environmental enrichment)', 'Protists'],
  ['plants-vascular', 'Vascular plants', 'Plantae'],
  ['plants-bryophytes', 'Bryophytes', 'Plantae'],
  ['fauna-microfauna', 'Soil microfauna (Nematoda, Tardigrada)', 'Animalia'],
  ['fauna-mesofauna-reared', 'Soil mesofauna (reared on controlled diet)', 'Animalia'],
  ['fauna-mesofauna-environmental', 'Soil mesofauna (environmental)', 'Animalia'],
  ['fauna-macrofauna-reared', 'Soil macrofauna (reared on controlled diet)', 'Animalia'],
  ['fauna-macrofauna-environmental', 'Soil macrofauna (environmental)', 'Animalia'],
  ['giant-viruses', 'Giant viruses (Nucleocytoviricota)', 'Nucleocytoviricota']
];

const extract = [
  ['bligh-dyer', 'Modified Bligh-Dyer extraction (reference)'],
  ['matyash-mtbe', 'Matyash MTBE extraction'],
  ['folch', 'Folch extraction'],
  ['custom-method', 'Custom extraction method (template)']
];

const biomassTemplate = (slug, name, kb) => `---
name: ${name}
file: sops/biomass/${slug}.md
version: "1.0"
last_updated: "${today}"
reviewers: ${reviewers}
tier: T1
kingdom_bucket: ${kb}
required_fields:
  - kingdom
  - phylum
  - species
  - provenance
  - purity
  - growth
  - biomass
  - preservation
taxon_specific_fields: []
---

# ${name}

## Source / collection

(Draft iteratively. Include: where organisms can be sourced — culture collections, environmental collection, voucher repositories — and identity authentication methods expected.)

## Media / substrate / diet

(Draft iteratively.)

## Growth / rearing conditions

(Draft iteratively. Include temperature, duration, light regime, oxygen tolerance where relevant.)

## Harvest protocol

(Draft iteratively. Include cell-count / OD / biomass thresholds, harvest timing, washing steps.)

## Purity verification

(Draft iteratively. Include Sanger / microscopy / plating checks expected.)

## Preservation and packaging

(Draft iteratively. Cross-reference \`_shared/biomass-measurement.md\` and \`_shared/shipping-logistics.md\`.)
`;

const extractTemplate = (slug, name) => `---
name: ${name}
file: sops/extract/${slug}.md
version: "1.0"
last_updated: "${today}"
reviewers: ${reviewers}
tier: T2
required_fields:
  - biomass
  - internal_standard
  - extraction
taxon_specific_fields: []
---

# ${name}

## Reference

(Draft iteratively. Include DOI of canonical publication.)

## Solvents and reagents

(Draft iteratively.)

## Procedure

(Draft iteratively.)

## Reporting requirements

Every extraction submission must declare: method, reference DOI (or attached PDF for custom), deviations, date, blanks count, final volume, storage conditions since extraction.
`;

fs.mkdirSync('sops/biomass', { recursive: true });
fs.mkdirSync('sops/extract', { recursive: true });

for (const [slug, name, kb] of biomass) {
  fs.writeFileSync(`sops/biomass/${slug}.md`, biomassTemplate(slug, name, kb));
}
for (const [slug, name] of extract) {
  fs.writeFileSync(`sops/extract/${slug}.md`, extractTemplate(slug, name));
}
console.log(`wrote ${biomass.length + extract.length} SOPs`);
