# soillifeatlas/contribute

Standardised submission flow for contributing biomass, lipid extracts, or spectra to the Soil Life Atlas.

**Live at:** https://soillifeatlas.org/contribute

## Structure

- `sops/` — 25 versioned SOPs (markdown with YAML frontmatter). Open a PR here to correct or extend a protocol.
- `schemas/` — JSON schemas for submissions + SOP frontmatter.
- `site/` — Astro 6 + Tailwind v4 static site. Builds to `site/dist/` for deployment under `/contribute/`.
- `backend/` — FastAPI service for draft persistence, submission intake, and email notifications.
- `ops/` — nginx + systemd + webhook configs for the Hetzner deployment.

## Licences

- Code: MIT (see `LICENSE`)
- SOPs + contributed data: CC-BY 4.0 (see `LICENSE-CONTENT`)

## Contact

rahul.samrat@univie.ac.at · CeMESS · University of Vienna
