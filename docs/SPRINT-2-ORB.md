# Sprint 2 — Floating Orb Foundation

## Delivered in this code update

- Split the native app into a compact `orb` window and a conventional `workspace` window.
- Orb window is transparent, undecorated, always-on-top, non-resizable and omitted from the Dock/taskbar.
- Orb is keyboard accessible and opens the workspace on click.
- Orb supports native window dragging with a 5 px movement threshold to distinguish drag from click.
- Orb position is restored at startup and persisted under the app configuration directory as `orb-position.json`.
- Closing the workspace hides it rather than terminating the application, leaving the orb available.
- Added a simple HARDEY application icon set to avoid an empty icon bundle configuration.
- Existing FastAPI task CRUD and SQLite persistence remain in place.

## Not delivered yet

- Voice output, voice selection, wake-word detection and multilingual speech recognition.
- Journal, calendar, project workspace, memory and AI chat.
- Reminder scheduler, quiet hours, priority speech queue and macOS sleep/wake reconciliation.
- Native backend sidecar packaging and process supervision.
- Monitor-aware recovery when a saved orb position belongs to a disconnected display.

## Test status

- Python backend syntax compilation: passed.
- FastAPI health and task CRUD smoke test: passed.
- Tauri/Rust and frontend production builds: not run in this environment. Rust/Cargo is unavailable here, and npm dependency installation did not complete within the execution window. Build and interaction verification must be performed on the target Mac.
