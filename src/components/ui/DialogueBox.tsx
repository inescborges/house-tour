import { useRef, useState } from "react";
import { useStore } from "../../state/useStore";
import { useVowelVoice } from "@/hooks/narrative/useVowelVoice";
import { useTypewriterDom } from "@/hooks/narrative/useTypewriterDom";

export function DialogueBox() {
  const dialogue = useStore((s) => s.currentDialogue);
  const dialogueId = useStore((s) => s.dialogueId);

  const textRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");

  useTypewriterDom(textRef, dialogue, dialogueId, 35, setTypedText);

  useVowelVoice(typedText, Boolean(dialogue), "host");

  return <div ref={textRef} className="texts-position" />;
}
