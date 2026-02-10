import { useStore } from "@/state/useStore";
import { PromptBox } from "./PromptBox";

export function InteriorDoorPrompt() {
  const dialogue = useStore((s) => s.currentDialogue);

  if (dialogue) return null;
  return (
    <PromptBox>
      Press <b>ENTER</b> to open
    </PromptBox>
  );
}
