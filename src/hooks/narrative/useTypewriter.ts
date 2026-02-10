import { useLayoutEffect, useState } from "react";

export function useTypewriter(
  text: string | null,
  dialogueId: number,
  speed = 40
) {
  const [displayed, setDisplayed] = useState("");

  useLayoutEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }

    // 🔒 LIMPA ANTES DO PAINT
    setDisplayed("");

    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const chars = Math.min(text.length, Math.floor(elapsed / speed));

      setDisplayed(text.slice(0, chars));

      if (chars < text.length) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [dialogueId, text, speed]);

  return displayed;
}
