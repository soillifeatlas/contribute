// Typed localStorage wrapper for wizard draft.
// v1 stores a single draft per browser; magic-link draft IDs rehydrate into the same key.

const KEY = 'contribute:draft:v1';

export interface WizardDraft {
  version: 1;
  step: number;                  // 1..9
  tier?: 'T1' | 'T2';
  kingdom_bucket?: string;
  sop_slug?: string;
  submitter?: {
    pi_name?: string;
    institution?: string;
    orcid?: string;
    contact_email?: string;
    magic_link_opt_in?: boolean;
  };
  taxonomy?: Record<string, string | null>;
  provenance?: Record<string, string | number | null>;
  purity?: string;
  growth?: Record<string, unknown>;
  biomass?: { wet_mg?: number | null; dry_mg?: number | null };
  preservation?: Record<string, unknown>;
  internal_standard?: Record<string, unknown>;
  isotope?: Record<string, unknown>;
  biosafety?: Record<string, unknown>;
  shipping?: Record<string, unknown>;
  extraction?: Record<string, unknown>;
  last_saved?: string;
}

function emptyDraft(): WizardDraft {
  return { version: 1, step: 1, last_saved: new Date().toISOString() };
}

export function loadDraft(): WizardDraft {
  if (typeof localStorage === 'undefined') return emptyDraft();
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptyDraft();
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return emptyDraft();
    return parsed as WizardDraft;
  } catch {
    return emptyDraft();
  }
}

export function saveDraft(d: WizardDraft): void {
  if (typeof localStorage === 'undefined') return;
  d.last_saved = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function clearDraft(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function patchDraft(patch: Partial<WizardDraft>): WizardDraft {
  const d = loadDraft();
  const merged = { ...d, ...patch, last_saved: new Date().toISOString() };
  saveDraft(merged);
  return merged;
}
