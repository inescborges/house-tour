import { useEffect } from "react";

export function useRetryOnEnter(enabled: boolean, onRetry: () => void) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter") onRetry();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onRetry]);
}
