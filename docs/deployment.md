# Deployment

Deployed alongside the main site on Hetzner (46.224.66.65). Path-routed at `soillifeatlas.org/contribute`.

## Layout on the host

```
/srv/soillifeatlas/
├── contribute/
│   ├── current -> releases/2026-04-25-abc1234
│   ├── releases/
│   │   └── 2026-04-25-abc1234/
│   │       ├── site/dist/    ← Astro static output
│   │       └── backend/      ← FastAPI app
│   ├── data/
│   │   └── contribute.sqlite  ← persistent across deploys
│   └── .env                    ← prod settings
```

## Nginx

See `ops/nginx/contribute.conf`. Routes:
- `/contribute/` → static files under `site/dist/`
- `/contribute/api/` → Unix socket at `/run/contribute-backend.sock` (FastAPI via uvicorn)
- `/contribute/api/*` is rewritten to `/api/*` before hitting uvicorn

## systemd

See `ops/systemd/contribute-backend.service`. Runs uvicorn bound to the socket; restarts on failure.

## Auto-deploy

Mirrors pipeline-site pattern: `adnanh/webhook` daemon on :9000 listens for GitHub push events (HMAC-SHA256 gated, ref=main only). On receipt:

1. `git clone` into a timestamped release dir
2. `npm ci && npm run build` in `site/`
3. Build Python venv in `backend/` and `pip install -e .`
4. Run schema migrations (none for v1)
5. Atomic symlink swap of `current` → new release
6. `systemctl restart contribute-backend`
7. Keep last 5 releases; prune older

See `deploy-hetzner.sh` for the full script.

## First-time setup

Run `deploy-hetzner.sh --bootstrap` on the host. Installs nginx conf + systemd unit + webhook config. Creates `/srv/soillifeatlas/contribute/data/` and seeds an empty `contribute.sqlite`.

## DNS + SSL

No DNS change needed — reuses `soillifeatlas.org`'s existing Let's Encrypt cert. Confirm nginx includes `/contribute/` in the existing server block rather than creating a new one.
