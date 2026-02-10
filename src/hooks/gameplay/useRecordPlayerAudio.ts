import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useRecordPlayerAudio(camera: THREE.Camera) {
  const listenerRef = useRef<THREE.AudioListener | null>(null);
  const soundRef = useRef<THREE.PositionalAudio | null>(null);

  const tracks = useRef<string[]>([
    "/audio/peter-tchaikovsky-march-from-nutcracker-classical-remix-7691.mp3",
    "/audio/franz-liszt-dreams-of-love-3-vers-b-8498.mp3",
    "/audio/gnossienne-1-erik-satie-175471.mp3",
  ]);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    listenerRef.current = listener;

    const sound = new THREE.PositionalAudio(listener);
    sound.setRefDistance(2);
    sound.setRolloffFactor(1);
    sound.setLoop(true);
    sound.setVolume(0);

    soundRef.current = sound;

    return () => {
      camera.remove(listener);
    };
  }, [camera]);

  const playTrack = (index: number) => {
    if (!soundRef.current) return;

    const loader = new THREE.AudioLoader();
    loader.load(tracks.current[index], (buffer) => {
      if (!soundRef.current) return;

      soundRef.current.setBuffer(buffer);
      soundRef.current.play();
      fadeTo(0.6);
    });
  };

  const stopTrack = () => {
    fadeTo(0, () => {
      soundRef.current?.stop();
    });
  };

  const fadeTo = (target: number, onComplete?: () => void) => {
    if (!soundRef.current) return;

    const sound = soundRef.current;
    const start = sound.getVolume();
    const duration = 0.5;
    let elapsed = 0;

    const tick = () => {
      elapsed += 0.016;
      const t = Math.min(elapsed / duration, 1);
      sound.setVolume(THREE.MathUtils.lerp(start, target, t));

      if (t < 1) requestAnimationFrame(tick);
      else onComplete?.();
    };

    tick();
  };

  return {
    soundRef,
    playTrack,
    stopTrack,
  };
}
