import { PromptBox } from "./PromptBox";
import { useStore } from "@/state/useStore";

export function BedPrompt() {
  const prompt = useStore((s) => s.currentPrompt);
  const isSleeping = useStore((s) => s.isSleeping);
  const dialogue = useStore((s) => s.currentDialogue);

  if (dialogue) return null;

  if (prompt !== "Sleep" || isSleeping) return null;

  return (
    <PromptBox>
      Press <b>ENTER</b> to get some rest
    </PromptBox>
  );
}
