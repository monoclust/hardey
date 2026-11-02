import { useRef, type PointerEvent, type KeyboardEvent } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";

const DRAG_THRESHOLD = 5;

type PointerOrigin = { x: number; y: number; dragging: boolean };

async function openWorkspace() {
  const workspace = await WebviewWindow.getByLabel("workspace");
  if (!workspace) {
    console.error("HARDEY workspace window is not registered.");
    return;
  }
  await workspace.show();
  await workspace.setFocus();
}

export default function FloatingOrb() {
  const origin = useRef<PointerOrigin | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    origin.current = { x: event.screenX, y: event.screenY, dragging: false };
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const start = origin.current;
    if (!start || start.dragging || (event.buttons & 1) !== 1) return;
    const distance = Math.hypot(event.screenX - start.x, event.screenY - start.y);
    if (distance >= DRAG_THRESHOLD) {
      start.dragging = true;
      void getCurrentWindow().startDragging().catch((error) => {
        console.error("HARDEY could not start window dragging:", error);
      });
    }
  }

  async function handlePointerUp() {
    const start = origin.current;
    origin.current = null;
    if (start && !start.dragging) {
      try {
        await openWorkspace();
      } catch (error) {
        console.error("HARDEY could not open the workspace:", error);
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void openWorkspace();
    }
  }

  return (
    <main className="orb-root" aria-label="HARDEY desktop assistant">
      <button
        className="hardey-orb"
        type="button"
        aria-label="Open HARDEY workspace. Drag to move the assistant."
        title="HARDEY — click to open, drag to move"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => void handlePointerUp()}
        onPointerCancel={() => { origin.current = null; }}
        onKeyDown={handleKeyDown}
      >
        <span className="orb-aura" />
        <span className="orb-core"><span className="orb-highlight" /></span>
        <span className="orb-ring" />
      </button>
    </main>
  );
}
