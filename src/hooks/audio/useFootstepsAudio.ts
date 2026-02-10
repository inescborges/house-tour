import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export function useFootstepsAudio(camera: THREE.Camera, volume = 0.6) {
  const footstepsRef = useRef<THREE.Audio | null>(null);

  useLayoutEffect(() => {
    if (!camera) return;

    const listener =
      camera.children.find((c) => c instanceof THREE.AudioListener) ??
      (() => {
        const l = new THREE.AudioListener();
        camera.add(l);
        return l;
      })();

    if (!footstepsRef.current) {
      const footsteps = new THREE.Audio(listener);
      camera.add(footsteps);

      new THREE.AudioLoader().load("/audio/footsteps.mp3", (b) => {
        footsteps.setBuffer(b);
        footsteps.setLoop(true);
        footsteps.setVolume(volume);
      });

      footstepsRef.current = footsteps;
    }
  }, [camera, volume]);

  return footstepsRef;
}
