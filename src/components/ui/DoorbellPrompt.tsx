import { useStore } from "@/state/useStore";
import { PromptBox } from "./PromptBox";

export function DoorbellPrompt() {
  const dialogue = useStore((s) => s.currentDialogue);

  if (dialogue) return null;

  return (
    <PromptBox>
      Press <b>ENTER</b> to ring doorbell
    </PromptBox>
  );
}
