import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DemonControllerParams {
  demonName: string;
  isLookingRef: React.RefObject<boolean>;
  onKill: () => void;
}

export function useDemonController({
  demonName,
  isLookingRef,
  onKill,
}: DemonControllerParams) {
  const { scene, camera } = useThree();

  const demonRef = useRef<THREE.Object3D | null>(null);

  const demonVisualRef = useRef<THREE.Object3D | null>(null);

  const soundRef = useRef<THREE.Audio | null>(null);

  const SPEED = 0.6;
  const KILL_DISTANCE = 0.9;

  // ─────────────────────────────
  // Setup audio
  // ─────────────────────────────
  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const loader = new THREE.AudioLoader();

    loader.load(
      "/audio/out-of-the-dark-creepy-and-scary-voices-9654.mp3",
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.35);
      },
    );

    soundRef.current = sound;

    return () => {
      camera.remove(listener);
    };
  }, [camera]);

  // ─────────────────────────────
  // Demon logic
  // ─────────────────────────────
  useFrame((_, delta) => {
    if (!demonRef.current) {
      demonRef.current = scene.getObjectByName(demonName) ?? null;
      demonVisualRef.current =
        scene.getObjectByName("Demon_PLACEHOLDER") ?? null;
      return;
    }

    const demon = demonRef.current;
    const demonVisual = demonVisualRef.current;

    if (!demonVisual) return;

    const demonVisualPos = demonVisual.getWorldPosition(new THREE.Vector3());
    const playerPos = camera.getWorldPosition(new THREE.Vector3());

    const distance = demonVisualPos.distanceTo(playerPos);

    // Kill
    if (distance < KILL_DISTANCE) {
      soundRef.current?.stop();
      onKill();
      return;
    }

    // Player not looking -> stop everything
    if (!isLookingRef.current) {
      if (soundRef.current?.isPlaying) {
        soundRef.current.stop();
      }
      return;
    }

    // Start sound
    if (soundRef.current && !soundRef.current.isPlaying) {
      soundRef.current.play();
    }

    // Direction
    const direction = new THREE.Vector3()
      .subVectors(playerPos, demonVisualPos)
      .normalize();

    // Moves demon
    demon.position.add(direction.multiplyScalar(SPEED * delta));
  });
}
