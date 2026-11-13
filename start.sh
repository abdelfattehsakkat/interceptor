#!/usr/bin/env bash
# Démarre le guide Classe II en local (http://localhost:5173).
# Usage : ./start.sh          -> serveur de développement
#         ./start.sh build    -> build de production puis aperçu (http://localhost:4173)
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installation des dépendances..."
  npm install
fi

case "${1:-dev}" in
  build)
    npm run build
    exec npm run preview
    ;;
  dev)
    exec npm run dev
    ;;
  *)
    echo "Usage : $0 [dev|build]" >&2
    exit 1
    ;;
esac
