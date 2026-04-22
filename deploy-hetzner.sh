#!/usr/bin/env bash
set -euo pipefail

APP_ROOT=/srv/soillifeatlas/contribute
REPO=https://github.com/soillifeatlas/contribute.git
STAMP=$(date -u +%Y-%m-%d)-$(git ls-remote $REPO main | cut -c1-7)
RELEASE_DIR="$APP_ROOT/releases/$STAMP"

if [[ "${1:-}" == "--bootstrap" ]]; then
  # First-time host setup: create dirs, user, nginx include, systemd unit, webhook
  sudo useradd -r -s /sbin/nologin contribute || true
  sudo mkdir -p "$APP_ROOT/releases" "$APP_ROOT/data"
  sudo chown -R contribute:contribute "$APP_ROOT"
  sudo cp ops/systemd/contribute-backend.service /etc/systemd/system/
  sudo cp ops/nginx/contribute.conf /etc/nginx/snippets/
  sudo systemctl daemon-reload
  echo "Add '  include /etc/nginx/snippets/contribute.conf;' to the main server block, then reload nginx."
  exit 0
fi

mkdir -p "$RELEASE_DIR"
git clone --depth 1 "$REPO" "$RELEASE_DIR"

pushd "$RELEASE_DIR/site"
npm ci
npm run build
popd

pushd "$RELEASE_DIR/backend"
python3 -m venv .venv
.venv/bin/pip install -e .
popd

ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
sudo systemctl restart contribute-backend

# keep only last 5 releases
ls -1dt "$APP_ROOT/releases/"*/ | tail -n +6 | xargs -r rm -rf

echo "deployed $STAMP"
