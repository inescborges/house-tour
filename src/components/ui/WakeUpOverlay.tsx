import { useStore } from "@/state/useStore";

export function WakeUpPrompt() {
  const prompt = useStore((s) => s.currentPrompt);
  const isSleeping = useStore((s) => s.isSleeping);

  if (prompt !== "Wake up" || !isSleeping) return null;

  return (
    <div className="texts-position wake-up">
      Press <b>ENTER</b> to wake up
    </div>
  );
}
