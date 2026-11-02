# HARDEY — The Personal AI Companion

Tauri 2 + React/TypeScript desktop companion with a floating orb shell and local-first task backend.

## Confirmed product configuration

- Stylized 3D female character direction (Sprint 1 uses a CSS avatar placeholder; real 3D model integration is Sprint 3/4).
- Local-first AI direction (Sprint 1 does not yet call an LLM).
- macOS login startup registered through the Tauri autostart plugin.
- Multilingual direction (English/Hindi UI toggle in this sprint; automatic language detection and spoken multilingual interaction are later work).
- Tauri 2 + React + TypeScript desktop shell.
- Separate floating orb and full workspace windows; the orb remains available when the workspace is hidden.
- Python FastAPI + SQLite task backend.

## Requirements

- macOS on Apple Silicon or Intel.
- Node.js 20.19+ or 22.12+ recommended.
- Python 3.11+.
- Rust toolchain (stable) and Xcode Command Line Tools.

## 1. Install macOS build prerequisites

```bash
xcode-select --install
```

Install Homebrew if it is not already present: https://brew.sh

```bash
brew install node python@3.12 rust
```

Tauri's macOS build prerequisites are documented at https://v2.tauri.app/start/prerequisites/ .

## 2. Start the Python backend

From the repository root:

```bash
cd apps/backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8765 --reload
```

The API is local-only at `http://127.0.0.1:8765`. Health check: `http://127.0.0.1:8765/health`.

## 3. Start the desktop application

Open a second Terminal window, return to the repository root, and run:

```bash
cd apps/desktop
npm install
npm run tauri dev
```

The first Rust/Tauri build can take several minutes. The desktop window is configured as transparent, undecorated and always-on-top.

## 4. Build a macOS installer

```bash
cd apps/desktop
npm run tauri build
```

Tauri output is normally placed under `apps/desktop/src-tauri/target/release/bundle/`.

## 5. Verify the backend

```bash
curl http://127.0.0.1:8765/health
curl http://127.0.0.1:8765/api/tasks
```

Create a task:

```bash
curl -X POST http://127.0.0.1:8765/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Review finance report","priority":"high","domain":"professional"}'
```

## Project structure

```text
apps/desktop/       Tauri + React desktop client
apps/backend/       FastAPI + SQLite service
scripts/            Local setup helpers
 docs/              Product and engineering documentation
```

## Current implementation scope

Implemented:
- Tauri desktop shell with a compact floating orb and separate workspace window.
- Draggable orb with a movement threshold, click-to-open workspace and persistent desktop coordinates.
- Workspace close action hides the window without closing the orb.
- Always-on-top transparent window.
- macOS login autostart registration.
- React task dashboard.
- English/Hindi interface toggle.
- FastAPI health endpoint and task CRUD endpoints.
- SQLite persistence.
- Priority-based next-task display.

Not implemented yet:
- Voice input/output, wake-word detection and automatic multilingual speech recognition.
- Journal, calendar, project workspace, AI chat and long-term memory.
- Reminder scheduling, quiet hours and queued spoken notifications.
- Real 3D model and skeletal animation.
- Ollama/local LLM integration.
- Voice input/output and automatic language detection.
- Native notification scheduling.
- Screen capture, OCR and accessibility integration.
- Automatic backend process supervision/packaging.
- User-facing autostart and permissions settings.

## Important operational note

For this starter, run the Python backend in its own Terminal session before using task persistence in the desktop UI. A later packaging milestone should ship and supervise the backend as a Tauri sidecar or bundled service. Do not expose the local API on `0.0.0.0`.

## Security baseline

- The backend binds to `127.0.0.1` only.
- No screen capture or microphone access is active in Sprint 1.
- No cloud AI requests or external data uploads are implemented.
- Do not add passwords, API keys or private documents to source control.
