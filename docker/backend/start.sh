#!/bin/sh
set -eu

echo "[backend] Running database migrations..."
npm run db:migrate

echo "[backend] Starting API server..."
node server.js
