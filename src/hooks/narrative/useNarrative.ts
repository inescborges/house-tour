import { useEffect } from "react";
import { useStore } from "../../state/useStore";

export function useNarrative() {
  const lastEvent = useStore((s) => s.lastEvent);
  const speak = useStore((s) => s.speak);
  const clearDialogue = useStore((s) => s.clearDialogue);
  const unlockControls = useStore((s) => s.unlockControls);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent) {
      case "DOOR_OPENED": {
        speak("Welcome! I was waiting for you!");

        const t = setTimeout(() => {
          clearDialogue();
        }, 3000);

        return () => clearTimeout(t);
      }

      case lastEvent?.startsWith("HOST_TALKED") && lastEvent: {
        speak(
          "I’m glad you came by. I don’t see many people anymore. They’re a little afraid of my neighbour.",
        );

        const t = setTimeout(() => {
          clearDialogue();
        }, 7000);

        return () => clearTimeout(t);
      }
    }
  }, [lastEvent, speak, clearDialogue, unlockControls]);
}
