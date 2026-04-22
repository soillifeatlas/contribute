import { describe, it, expect, beforeEach } from 'vitest';
import { loadDraft, saveDraft, patchDraft, clearDraft } from './draft-state';

describe('draft-state', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty draft when nothing saved', () => {
    const d = loadDraft();
    expect(d.version).toBe(1);
    expect(d.step).toBe(1);
  });

  it('persists a draft across reads', () => {
    saveDraft({ version: 1, step: 3, tier: 'T1' });
    const d = loadDraft();
    expect(d.step).toBe(3);
    expect(d.tier).toBe('T1');
  });

  it('patch merges without losing prior fields', () => {
    saveDraft({ version: 1, step: 2, submitter: { pi_name: 'Jane' } });
    patchDraft({ step: 3, tier: 'T2' });
    const d = loadDraft();
    expect(d.step).toBe(3);
    expect(d.tier).toBe('T2');
    expect(d.submitter?.pi_name).toBe('Jane');
  });

  it('clear resets to empty', () => {
    saveDraft({ version: 1, step: 5 });
    clearDraft();
    expect(loadDraft().step).toBe(1);
  });

  it('rejects corrupt JSON', () => {
    localStorage.setItem('contribute:draft:v1', 'not json');
    expect(loadDraft().step).toBe(1);
  });
});
