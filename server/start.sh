#!/bin/sh
# Akıl Çantası — Bilgi Noktası (Linux / macOS)
cd "$(dirname "$0")/.." || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js bulunamadı. https://nodejs.org adresinden kurun (>= 18)."
  exit 1
fi
[ -f dist/index.html ] || echo "UYARI: dist/index.html yok. Önce: npm run build"
mkdir -p data
exec node server/server.mjs "$@"
