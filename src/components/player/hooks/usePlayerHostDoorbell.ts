import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "@/state/useStore";
import { useDoorbellSequence } from "@/hooks/doors/useDoorbellSequence";
import { useInteractable } from "@/hooks/gameplay/useInteractable";

export function usePlayerHostDoorbell({
  movement,
  isDeadRef,
  doorbellSoundRef,
  hostFootstepsRef,
  onDoorbellFocus,
  onDoorbellRing,
  onEntranceDoorOpen,
}: {
  movement: any;
  isDeadRef: React.RefObject<boolean>;
  doorbellSoundRef: React.RefObject<any>;
  hostFootstepsRef: React.RefObject<any>;
  onDoorbellFocus?: (v: boolean) => void;
  onDoorbellRing?: () => void;
  onEntranceDoorOpen: () => void;
}) {
  const hasRungDoorbell = useStore((s) => s.hasRungDoorbell);

  const { activeRef } = useInteractable({
    targetName: "Doorbell",
    maxDistance: 2.5,
    enabled: !hasRungDoorbell,
  });

  const lastStateRef = useRef<boolean | null>(null);
  const enterHandledRef = useRef(false);

  const playDoorbellSequence = useDoorbellSequence(
    hostFootstepsRef.current,
    onEntranceDoorOpen,
  );

  useFrame(() => {
    if (isDeadRef.current) return;

    const canRing = !!activeRef.current;

    if (lastStateRef.current !== canRing) {
      lastStateRef.current = canRing;
      onDoorbellFocus?.(canRing);
    }

    if (!movement.current.enter) {
      enterHandledRef.current = false;
    } else if (canRing && !enterHandledRef.current) {
      enterHandledRef.current = true;
      doorbellSoundRef.current?.play();
      onDoorbellRing?.();
      playDoorbellSequence();
    }
  });
}
