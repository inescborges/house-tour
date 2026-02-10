import { useLookAtDemon } from "@/hooks/camera/useLookAtDemon";
import { useDemonController } from "@/hooks/entities/useDemonController";

export function usePlayerDemon({ onKill }: { onKill: () => void }) {
  const lookingAtDemon = useLookAtDemon("Demon_PLACEHOLDER");

  useDemonController({
    demonName: "Demon_INSTANCE",
    isLookingRef: lookingAtDemon,
    onKill,
  });
}
