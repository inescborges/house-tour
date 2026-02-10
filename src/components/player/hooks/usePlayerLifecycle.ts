import { useRef } from "react";

export function usePlayerLifecycle({
  onDeath,
  onDoorbellFocus,
}: {
  onDeath: () => void;
  onDoorbellFocus?: (v: boolean) => void;
}) {
  const isDeadRef = useRef(false);

  const killPlayer = () => {
    if (isDeadRef.current) return;

    isDeadRef.current = true;
    onDoorbellFocus?.(false);
    onDeath();
  };

  return {
    isDeadRef,
    killPlayer,
  };
}
