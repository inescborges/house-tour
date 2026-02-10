import { useEffect, useRef } from "react";

export type KeyboardState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  enter: boolean;
  c: boolean;
};

/**
 * Lightweight keyboard input handler for FPS-style movement.
 * Tracks WASD state using a mutable ref (no re-renders).
 */
export function useKeyboard() {
  const movement = useRef<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    enter: false,
    c: false,
  });

  // Map keyboard keys to movement flags
  const keyMap: Record<string, keyof KeyboardState> = {
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right",
    Enter: "enter",
    KeyC: "c",
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = keyMap[e.code];
      if (!key) return; // ignore irrelevant keys
      movement.current[key] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = keyMap[e.code];
      if (!key) return;
      movement.current[key] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return movement;
}
