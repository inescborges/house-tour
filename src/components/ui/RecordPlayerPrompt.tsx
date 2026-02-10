import { PromptBox } from "./PromptBox";
import { useStore } from "@/state/useStore";

export function RecordPlayerPrompt() {
  const currentPrompt = useStore((s) => s.currentPrompt);
  const dialogue = useStore((s) => s.currentDialogue);

  if (dialogue) return null;
  if (!currentPrompt) return null;

  return (
    <PromptBox>
      {currentPrompt === "Play record" && (
        <>
          Press <b>ENTER</b> to play record
        </>
      )}

      {currentPrompt === "Change record / Turn off" && (
        <>
          Press <b>C</b> to change record /
          <br />
          Press <b>ENTER</b> to turn off
        </>
      )}
    </PromptBox>
  );
}
