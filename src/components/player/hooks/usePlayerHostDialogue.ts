import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useInteractable } from "@/hooks/gameplay/useInteractable";
import { useStore } from "@/state/useStore";

export function usePlayerHostDialogue({
  movement,
  isDeadRef,
  onPromptChange,
}: {
  movement: any;
  isDeadRef: React.RefObject<boolean>;
  onPromptChange?: (p: string | null) => void;
}) {
  const { triggerEvent } = useStore();

  const { activeRef } = useInteractable({
    targetName: "Host_INSTANCE",
    maxDistance: 3,
    enabled: true,
  });

  const enterHandledRef = useRef(false);
  const lastPromptRef = useRef<string | null>(null);

  useFrame(() => {
    if (isDeadRef.current) return;

    const isFocused = !!activeRef.current;
    let prompt: string | null = null;

    // Prompt always "on"
    if (isFocused) {
      prompt = "Talk";
    }

    if (prompt !== lastPromptRef.current) {
      lastPromptRef.current = prompt;
      onPromptChange?.(prompt);
    }

    // Lost focus - clear prompt
    if (!isFocused) {
      if (lastPromptRef.current !== null) {
        lastPromptRef.current = null;
        onPromptChange?.(null);
      }
      return;
    }

    // ENTER (anti-hold) ─────────────
    if (!movement.current.enter) {
      enterHandledRef.current = false;
      return;
    }

    if (enterHandledRef.current) return;
    enterHandledRef.current = true;

    triggerEvent(`HOST_TALKED_${Date.now()}`);
  });
}
