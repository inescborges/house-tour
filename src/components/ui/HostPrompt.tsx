import { PromptBox } from "./PromptBox";
import { useStore } from "@/state/useStore";

export function HostPrompt() {
  const prompt = useStore((s) => s.currentPrompt);
  const dialogue = useStore((s) => s.currentDialogue);

  if (dialogue) return null;
  if (prompt !== "Talk") return null;

  return (
    <PromptBox>
      Press <b>ENTER</b> to speak
    </PromptBox>
  );
}
