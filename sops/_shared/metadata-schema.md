---
name: Metadata schema for contributions
file: sops/_shared/metadata-schema.md
version: "1.0"
last_updated: "2026-04-21"
reviewers: [rahul.samrat@univie.ac.at]
tier: shared
citation: "Contribute SOP metadata-schema v1.0 (2026)."
---

# Metadata schema for contributions

Authoritative list of fields captured on every submission, regardless of tier. Tier- and taxon-specific fields are declared in their respective SOP frontmatter.

## Universal required fields

(Content drafted separately — see `schemas/submission.schema.json` for the machine-readable source of truth.)

## How fields are collected

- The wizard reads this SOP's companion JSON schema to validate inputs.
- Taxon-specific fields come from each biomass SOP's `taxon_specific_fields` frontmatter array.
- Every submission is validated server-side against `schemas/submission.schema.json` before being accepted.
