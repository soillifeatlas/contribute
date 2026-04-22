export const STEPS = [
  { num: 1, id: 'welcome', label: 'Welcome' },
  { num: 2, id: 'you', label: 'You' },
  { num: 3, id: 'tier', label: 'Tier' },
  { num: 4, id: 'taxon', label: 'Taxon' },
  { num: 5, id: 'sample', label: 'Sample' },
  { num: 6, id: 'biomass', label: 'Biomass' },
  { num: 7, id: 'is-isotope', label: 'IS / isotope' },
  { num: 8, id: 'extraction', label: 'Extraction' },
  { num: 9, id: 'review', label: 'Review' }
] as const;

export type StepId = typeof STEPS[number]['id'];

export function stepByNumber(n: number) {
  return STEPS.find(s => s.num === n) ?? STEPS[0];
}

export function stepById(id: string) {
  return STEPS.find(s => s.id === id);
}

export function isExtractionSkipped(tier?: string) {
  return tier === 'T1';
}

export function nextStep(currentNum: number, tier?: string): number {
  let next = currentNum + 1;
  if (next === 8 && isExtractionSkipped(tier)) next = 9;
  return Math.min(next, 9);
}

export function prevStep(currentNum: number, tier?: string): number {
  let prev = currentNum - 1;
  if (prev === 8 && isExtractionSkipped(tier)) prev = 7;
  return Math.max(prev, 1);
}
