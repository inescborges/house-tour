import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface UseInteractableProps {
  targetName?: string;
  namePrefix?: string;
  maxDistance: number;
  nearDistance?: number;
  enabled?: boolean;
}

export function useInteractable({
  targetName,
  namePrefix,
  maxDistance,
  nearDistance = 1.0,
  enabled = true,
}: UseInteractableProps) {
  const { scene, camera } = useThree();

  const activeRef = useRef<THREE.Object3D | null>(null);

  const camPos = new THREE.Vector3();
  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const projected = new THREE.Vector3();

  useFrame(() => {
    if (!enabled) {
      activeRef.current = null;
      return;
    }

    camera.getWorldPosition(camPos);

    let best: THREE.Object3D | null = null;
    let bestDist = Infinity;

    scene.traverse((obj) => {
      // 🎯 filtro por nome
      if (targetName && obj.name !== targetName) return;
      if (namePrefix && !obj.name.startsWith(namePrefix)) return;

      box.setFromObject(obj);
      box.getCenter(center);

      const dist = center.distanceTo(camPos);
      if (dist > maxDistance) return;

      // Override due to extreme proximity
      if (dist <= nearDistance) {
        activeRef.current = obj;
        return;
      }

      projected.copy(center).project(camera);

      const onScreen =
        projected.z > 0 &&
        projected.x >= -1 &&
        projected.x <= 1 &&
        projected.y >= -1 &&
        projected.y <= 1;

      if (!onScreen) return;

      if (dist < bestDist) {
        best = obj;
        bestDist = dist;
      }
    });

    activeRef.current = best;
  });

  return {
    activeRef,
  };
}
