import { listSops } from './sops';

export interface KingdomBucket {
  key: string;
  label: string;
  color: string;
  sopCount: number;
  examples: string;
  inAtlas: string;
}

export const KINGDOM_BUCKETS: KingdomBucket[] = [
  {
    key: 'Bacteria',
    label: 'Bacteria',
    color: 'var(--color-k-bacteria)',
    sopCount: 1,
    examples: 'Isolates · enrichments · defined communities',
    inAtlas: 'Atlas: 6/10 phyla · seeking: Acidobacteriota, Verrucomicrobiota, Planctomycetota'
  },
  {
    key: 'Archaea',
    label: 'Archaea',
    color: 'var(--color-k-archaea)',
    sopCount: 1,
    examples: 'Methanogens · thermoacidophiles · AOA',
    inAtlas: 'Atlas: 4/6 phyla · seeking: AOA (Thaumarchaeota)'
  },
  {
    key: 'Fungi',
    label: 'Fungi',
    color: 'var(--color-k-fungi)',
    sopCount: 3,
    examples: 'Filamentous · yeast · AMF',
    inAtlas: 'Atlas: 3/5 phyla · seeking: Glomeromycota, Mucoromycota'
  },
  {
    key: 'Protists',
    label: 'Protists',
    color: 'var(--color-k-protists)',
    sopCount: 2,
    examples: 'Axenic culture · environmental enrichment',
    inAtlas: 'Atlas: 3/8 phyla · seeking: Ciliophora, Cercozoa'
  },
  {
    key: 'Algae',
    label: 'Algae',
    color: 'var(--color-k-algae)',
    sopCount: 2,
    examples: 'Microalgae · macroalgae',
    inAtlas: 'Atlas: 5 phyla · broader diversity welcome'
  },
  {
    key: 'Plantae',
    label: 'Plantae',
    color: 'var(--color-k-plants)',
    sopCount: 2,
    examples: 'Vascular plants · bryophytes',
    inAtlas: 'Atlas: 2/4 phyla · seeking: grasses, forbs, woody'
  },
  {
    key: 'Animalia',
    label: 'Animalia',
    color: 'var(--color-k-animalia)',
    sopCount: 5,
    examples: 'Micro, meso, macrofauna — reared or wild',
    inAtlas: 'Atlas: 4/7 phyla · seeking: Enchytraeidae, Myriapoda, Isopoda'
  },
  {
    key: 'Nucleocytoviricota',
    label: 'Giant viruses',
    color: 'var(--color-k-viruses)',
    sopCount: 1,
    examples: 'Nucleocytoviricota · host-cell lysate',
    inAtlas: 'Emerging — all contributions welcome'
  }
];

export function sopsForBucket(bucketKey: string) {
  return listSops().filter(
    (s) => s.category === 'biomass' && s.frontmatter.kingdom_bucket === bucketKey
  );
}
