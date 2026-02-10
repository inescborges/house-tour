import { useInteractable } from "@/hooks/gameplay/useInteractable";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/state/useStore";
import { useRef } from "react";

export function usePlayerBed({
  movement,
  isDeadRef,
  onPromptChange,
}: {
  movement: any;
  isDeadRef: React.RefObject<boolean>;
  onPromptChange?: (p: string | null) => void;
}) {
  const { isSleeping, startSleep, wakeUp, lockControls, unlockControls } =
    useStore();

  const { activeRef } = useInteractable({
    targetName: "Bed_INTERACT",
    maxDistance: 3,
    enabled: true,
  });

  const lastPromptRef = useRef<string | null>(null);
  const enterHandledRef = useRef(false);

  useFrame(() => {
    if (isDeadRef.current) return;
    const isFocused = !!activeRef.current;
    let prompt: string | null = null;

    if (isFocused && !isSleeping) {
      prompt = "Sleep";
    }

    if (prompt !== lastPromptRef.current) {
      lastPromptRef.current = prompt;
      onPromptChange?.(prompt);
    }

    if (!isFocused) {
      if (lastPromptRef.current !== null) {
        lastPromptRef.current = null;
        onPromptChange?.(null);
      }
      return;
    }

    if (!movement.current.enter) {
      enterHandledRef.current = false;
      return;
    }

    if (enterHandledRef.current) return;
    enterHandledRef.current = true;

    if (!isSleeping) {
      lockControls();
      startSleep();
    } else {
      wakeUp();
      unlockControls();
    }
  });
}
