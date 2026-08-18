#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"

ensure_local_services() {
  if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    echo "[medusa] Starting PostgreSQL..."
    if command -v pg_ctlcluster >/dev/null 2>&1; then
      sudo pg_ctlcluster 16 main start >/dev/null 2>&1 || true
    fi
    if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
      echo "[medusa] PostgreSQL is not running on 127.0.0.1:5432" >&2
      exit 1
    fi
  fi

  if ! redis-cli ping >/dev/null 2>&1; then
    echo "[medusa] Starting Redis..."
    redis-server --daemonize yes --port 6379 --bind 127.0.0.1 >/dev/null 2>&1 || true
  fi
}

cd "$BACKEND"
ensure_local_services

if [ ! -f "node_modules/@medusajs/cli/cli.js" ] && [ ! -x "node_modules/.bin/medusa" ]; then
  echo "[medusa] Installing backend dependencies..."
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install
  else
    npm install
  fi
fi

run_medusa() {
  if [ -x "node_modules/.bin/medusa" ]; then
    ./node_modules/.bin/medusa "$@"
  elif command -v pnpm >/dev/null 2>&1; then
    pnpm exec medusa "$@"
  else
    npx medusa "$@"
  fi
}

echo "[medusa] Running database migrations..."
if ! run_medusa db:migrate; then
  echo "[medusa] db:migrate failed — check DATABASE_URL and PostgreSQL" >&2
  exit 1
fi

echo "[medusa] Starting development server..."
if [ -x "node_modules/.bin/medusa" ]; then
  exec ./node_modules/.bin/medusa develop
elif command -v pnpm >/dev/null 2>&1; then
  exec pnpm exec medusa develop
else
  exec npx medusa develop
fi
