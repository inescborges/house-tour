import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export function usePlayerHostAudio(camera: THREE.Camera) {
  const listenerRef = useRef<THREE.AudioListener | null>(null);
  const doorbellSoundRef = useRef<THREE.Audio | null>(null);

  useLayoutEffect(() => {
    if (!camera) return;

    if (!listenerRef.current) {
      const listener = new THREE.AudioListener();
      camera.add(listener);
      listenerRef.current = listener;
    }

    const listener = listenerRef.current;

    if (!doorbellSoundRef.current) {
      const doorbell = new THREE.Audio(listener);
      camera.add(doorbell);

      new THREE.AudioLoader().load("/audio/doorbell.mp3", (b) => {
        doorbell.setBuffer(b);
        doorbell.setVolume(0.1);
      });

      doorbellSoundRef.current = doorbell;
    }
  }, [camera]);

  return { doorbellSoundRef };
}
