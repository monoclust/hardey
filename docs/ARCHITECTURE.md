# Hardey Sprint 1 Architecture

## Runtime topology

- Tauri owns the macOS desktop window and application lifecycle.
- React renders the companion and task dashboard.
- FastAPI runs as a local service bound to `127.0.0.1:8765`.
- SQLite persists task data in the backend working directory.
- The desktop frontend communicates with the backend over HTTP.

## Trust boundaries

The desktop UI is not a trusted source of authorization. Future privileged operations must be implemented behind explicit backend/native permission checks. The local API is loopback-only and must not be rebound to a public interface.

## Planned local-first AI boundary

A future `model_router` will select a local inference endpoint first. Cloud fallback must be separately enabled and pass through a redaction/minimization layer. Task CRUD and reminder scheduling must never depend on an LLM response.

## Planned native service boundary

Screen capture, accessibility, microphone and file indexing belong in dedicated native/integration services. They must have explicit per-capability permission states, visible activity indicators, application/file exclusions and auditable events.

## Backend lifecycle gap

Sprint 1 runs the backend separately. Production packaging must bundle a signed backend executable or sidecar, supervise its lifecycle, wait for health readiness, restart on failure with bounded backoff, and stop it cleanly when the desktop application exits.
