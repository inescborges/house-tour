import { useCallback } from "react";
import { useStore } from "../../state/useStore";
import * as THREE from "three";

export function useDoorbellSequence(
  footsteps: THREE.Audio | null,
  openDoor: () => void
) {
  const triggerEvent = useStore((s) => s.triggerEvent);
  const DOOR_OPEN_DELAY = 3200;

  return useCallback(() => {
    setTimeout(() => {
      footsteps?.play();
    }, 250);

    setTimeout(() => {
      footsteps?.stop();
      openDoor();
      triggerEvent("DOOR_OPENED");
    }, DOOR_OPEN_DELAY);
  }, [footsteps, openDoor, triggerEvent]);
}
