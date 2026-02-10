import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useInteractable } from "@/hooks/gameplay/useInteractable";
import { useStore } from "@/state/useStore";

export function usePlayerInteriorDoors({
  movement,
  locked,
  onDoorbellFocus,
}: {
  movement: any;
  locked: boolean;
  onDoorbellFocus?: (v: boolean) => void;
}) {
  const { activeRef } = useInteractable({
    namePrefix: "Handle_INTERACT",
    maxDistance: 2,
    enabled: locked,
  });

  const lastInteriorDoorRef = useRef<string | null>(null);
  const lastEnterRef = useRef(false);

  const focusInteriorDoor = useStore((s) => s.focusInteriorDoor);
  const openInteriorDoor = useStore((s) => s.openInteriorDoor);
  const openedInteriorDoors = useStore((s) => s.openedInteriorDoors);
  const openingDoor = useStore((s) => s.interiorDoorEvent);

  useFrame(() => {
    const handleObj = activeRef.current;
    const doorObj = handleObj?.parent ?? null;
    const doorName = doorObj?.name ?? null;

    // Hide prompt when door is opening
    if (doorName && doorName === openingDoor) {
      if (lastInteriorDoorRef.current !== null) {
        lastInteriorDoorRef.current = null;
        focusInteriorDoor(null);
      }
      return;
    }

    // Hide prompt if door is already open
    if (doorName && openedInteriorDoors.has(doorName)) {
      if (lastInteriorDoorRef.current !== null) {
        lastInteriorDoorRef.current = null;
        focusInteriorDoor(null);
      }
      return;
    }

    if (doorName !== lastInteriorDoorRef.current) {
      lastInteriorDoorRef.current = doorName;
      focusInteriorDoor(doorName);

      if (doorName) {
        onDoorbellFocus?.(false);
      }
    }

    const enterPressed = movement.current.enter && !lastEnterRef.current;
    if (doorName && enterPressed) {
      openInteriorDoor();

      // Remove prompt immediately to prevent spamming
      focusInteriorDoor(null);
      lastInteriorDoorRef.current = null;
    }

    lastEnterRef.current = movement.current.enter;
  });
}
