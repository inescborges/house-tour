import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/state/useStore";
import { useRef } from "react";

const OPEN_SPEED = 4;
const FULL_OPEN_ANGLE = -Math.PI / 2;

export function useOpenInteriorDoors() {
  const { scene, camera } = useThree();
  const doorName = useStore((s) => s.interiorDoorEvent);

  const doorRef = useRef<THREE.Object3D | null>(null);
  const markInteriorDoorOpened = useStore((s) => s.markInteriorDoorOpened);
  const soundRef = useRef<THREE.Audio | null>(null);

  if (!soundRef.current) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    new THREE.AudioLoader().load("/audio/door_open.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setVolume(0.5);
    });

    soundRef.current = sound;
  }

  useFrame((_, delta) => {
    if (!doorName) return;

    if (!doorRef.current) {
      doorRef.current = scene.getObjectByName(doorName) ?? null;
      if (!doorRef.current) return;

      soundRef.current?.play();
    }

    const door = doorRef.current;

    door.rotation.y = THREE.MathUtils.lerp(
      door.rotation.y,
      FULL_OPEN_ANGLE,
      delta * OPEN_SPEED,
    );

    if (Math.abs(door.rotation.y - FULL_OPEN_ANGLE) < 0.01) {
      markInteriorDoorOpened(doorName);
      doorRef.current = null;
    }
  });
}
