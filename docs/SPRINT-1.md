# Sprint 1 — Desktop Foundation

## Goal
Deliver a runnable macOS desktop shell connected to a persistent local task service.

## Stories and acceptance criteria

1. **Desktop shell** — Tauri launches the React UI in a transparent, undecorated, always-on-top window.
2. **Login startup** — Tauri autostart plugin registers a macOS LaunchAgent on first application setup. Validate actual behavior on the target macOS version and provide a user-visible disable control in a later sprint.
3. **Backend health** — FastAPI responds on loopback at `/health`.
4. **Task persistence** — POST creates tasks; GET lists tasks; PATCH changes status; DELETE removes tasks. Data persists in SQLite.
5. **Task dashboard** — UI displays tasks and the highest-priority active task.
6. **Multilingual foundation** — UI includes a basic English/Hindi toggle. Automatic detection and voice localization are out of scope.
7. **Offline operation** — Task CRUD works without internet after dependencies are installed.

## Sprint 1 exit checklist

- [ ] Install Xcode Command Line Tools, Node, Python and Rust.
- [ ] Install backend requirements.
- [ ] Run API and verify health endpoint.
- [ ] Install frontend dependencies.
- [ ] Launch `npm run tauri dev`.
- [ ] Create a task and verify it appears after restarting the backend.
- [ ] Mark a task complete and verify persisted status.
- [ ] Test always-on-top and transparent window behavior.
- [ ] Install packaged app and validate macOS login startup.
- [ ] Confirm the user can remove Hardey from Login Items before wider distribution.

## Known limitations

The stylized avatar is a CSS illustration, not the final 3D character. The backend is currently launched separately in Terminal. Autostart registers the desktop shell, not the Python service. These are explicit follow-on tasks, not hidden assumptions.
