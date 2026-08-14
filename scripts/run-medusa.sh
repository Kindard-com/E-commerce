#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"

cd "$BACKEND"

if [ ! -f "node_modules/@medusajs/cli/cli.js" ] && [ ! -x "node_modules/.bin/medusa" ]; then
  echo "[medusa] Installing backend dependencies..."
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install
  else
    npm install
  fi
fi

if [ -x "node_modules/.bin/medusa" ]; then
  exec ./node_modules/.bin/medusa develop
fi

if command -v pnpm >/dev/null 2>&1; then
  exec pnpm exec medusa develop
fi

exec npx medusa develop
