import { describe, it, expect } from 'vitest';
import { STEPS, nextStep, prevStep, isExtractionSkipped } from './wizard-steps';

describe('wizard-steps', () => {
  it('has 9 steps', () => { expect(STEPS.length).toBe(9); });
  it('skips step 8 when tier is T1 going forward', () => {
    expect(nextStep(7, 'T1')).toBe(9);
  });
  it('includes step 8 when tier is T2', () => {
    expect(nextStep(7, 'T2')).toBe(8);
  });
  it('skips step 8 going backward from 9 when T1', () => {
    expect(prevStep(9, 'T1')).toBe(7);
  });
  it('clamps at 1 and 9', () => {
    expect(prevStep(1, 'T1')).toBe(1);
    expect(nextStep(9, 'T1')).toBe(9);
  });
});
