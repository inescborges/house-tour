import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const OPEN_SPEED = 3.0;
const FULL_OPEN_ANGLE = -Math.PI / 2;

export function useOpenEntranceDoor(shouldOpenRef: React.RefObject<boolean>) {
  const { scene } = useThree();
  const doorRef = useRef<THREE.Object3D | null>(null);

  useFrame((_, delta) => {
    if (!shouldOpenRef.current) return;

    if (!doorRef.current) {
      doorRef.current = scene.getObjectByName("Door_Entrance") ?? null;
      return;
    }

    const door = doorRef.current;

    // Opens progressively
    door.rotation.y = THREE.MathUtils.lerp(
      door.rotation.y,
      FULL_OPEN_ANGLE,
      delta * OPEN_SPEED,
    );
  });
}
