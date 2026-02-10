import { useLayoutEffect } from "react";
import type { RefObject } from "react";

export function useTypewriterDom(
  ref: RefObject<HTMLElement | null>,
  text: string | null,
  dialogueId: number,
  speed = 40,
  onTextChange?: (currentText: string) => void, // 👈 NOVO
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.textContent = "";
    onTextChange?.("");

    if (!text) return;

    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      i++;
      const current = text.slice(0, i);
      el.textContent = current;

      onTextChange?.(current);

      if (i < text.length) {
        setTimeout(tick, speed);
      }
    };

    tick();

    return () => {
      cancelled = true;
      el.textContent = "";
      onTextChange?.("");
    };
  }, [text, dialogueId, speed, ref, onTextChange]);
}
