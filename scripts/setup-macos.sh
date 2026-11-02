#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

command -v node >/dev/null || { echo "Node.js is missing. Install it with: brew install node"; exit 1; }
command -v python3 >/dev/null || { echo "Python 3 is missing. Install it with: brew install python@3.12"; exit 1; }
command -v cargo >/dev/null || { echo "Rust is missing. Install it with: brew install rust"; exit 1; }

python3 -m venv "$ROOT/apps/backend/.venv"
"$ROOT/apps/backend/.venv/bin/python" -m pip install --upgrade pip
"$ROOT/apps/backend/.venv/bin/pip" install -r "$ROOT/apps/backend/requirements.txt"
(cd "$ROOT/apps/desktop" && npm install)

echo "\nHardey dependencies installed.\n"
echo "Terminal 1: cd '$ROOT/apps/backend' && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8765 --reload"
echo "Terminal 2: cd '$ROOT/apps/desktop' && npm run tauri dev"
