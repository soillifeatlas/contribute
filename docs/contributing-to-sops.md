# Contributing corrections and additions to the SOPs

The SOPs in this repo are community-edited. If you spot a mistake, can add detail, or want to add a new taxon's SOP, open a pull request.

## Quick start

1. Fork `soillifeatlas/contribute` on GitHub.
2. Edit the markdown file directly — everything under `sops/` is editable.
3. Bump the `version` field in the frontmatter (patch bump for corrections, minor bump for new sections, major bump for structural changes).
4. Update `last_updated` to today's date.
5. Add yourself to `reviewers` if you're not already listed.
6. Open a PR. CI will validate your frontmatter against the schema.

## Frontmatter schema

All SOP files must have frontmatter matching `schemas/sop-frontmatter.schema.json`. Key fields:

- `name` — display name
- `file` — path relative to repo root (must match actual path)
- `version` — semver-ish (e.g., `1.2`)
- `last_updated` — ISO date
- `reviewers` — list of email addresses
- `tier` — `T1`, `T2`, or `shared`
- `kingdom_bucket` — for biomass SOPs, one of the fixed kingdom buckets (including "Algae" as a UX grouping)
- `required_fields` — schema keys always required for this taxon
- `taxon_specific_fields` — array of `{ key, label, type, options?, required?, hint? }` objects injected into the wizard's sample-details step

## Adding a new SOP

1. Copy an existing SOP as a template.
2. Pick an appropriate slug (lowercase, hyphenated) and place under the correct subfolder.
3. Update the frontmatter completely.
4. If you're adding a new kingdom bucket, also add it to `site/src/lib/kingdom-buckets.ts`.
5. Open a PR — include a note about why the split makes sense taxonomically.

## Style

- Keep sections short and scannable. Researchers read protocol pages in pieces, not linearly.
- Reference the canonical publication where possible (DOI link).
- Cross-reference `_shared/` SOPs instead of duplicating their content.
- Use Markdown tables for anything comparative (media compositions, solvent ratios, etc.).
