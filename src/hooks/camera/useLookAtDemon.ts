import { useStore } from "@/state/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function useLookAtDemon(demonName: string) {
  const { camera, scene } = useThree();
  const isLookingRef = useRef(false);
  const setLooking = useStore((s) => s.setLookingAtDemon);

  const frustum = useRef(new THREE.Frustum());
  const projScreenMatrix = useRef(new THREE.Matrix4());
  const raycaster = useRef(new THREE.Raycaster());
  const demonDir = useRef(new THREE.Vector3());

  const visibleFrames = useRef(0);
  const invisibleFrames = useRef(0);
  const REQUIRED_FRAMES = 3;

  useFrame(() => {
    const demon = scene.getObjectByName(demonName);
    let canSee = true;

    if (!demon) {
      canSee = false;
    } else {
      /* ─────────────────────────────
         Frustum: is it in the camera's view?
      ───────────────────────────── */
      projScreenMatrix.current.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      );
      frustum.current.setFromProjectionMatrix(projScreenMatrix.current);

      if (!frustum.current.intersectsObject(demon)) {
        canSee = false;
      }

      /* ─────────────────────────────
         Raycast: is there a wall in the way?
      ───────────────────────────── */
      if (canSee) {
        const cameraPos = camera.getWorldPosition(new THREE.Vector3());
        demonDir.current.copy(demon.position).sub(cameraPos).normalize();

        const demonDistance = cameraPos.distanceTo(demon.position);

        const rayOrigin = cameraPos
          .clone()
          .add(demonDir.current.clone().multiplyScalar(0.1));

        raycaster.current.set(rayOrigin, demonDir.current);
        raycaster.current.far = demonDistance;

        const hits = raycaster.current.intersectObjects(scene.children, true);

        if (hits.length > 0) {
          const hit = hits[0].object;
          const isDemon = hit === demon || demon.children.includes(hit);

          if (!isDemon) {
            canSee = false;
          }
        }
      }
    }

    /* ─────────────────────────────
       Temporal stabilization
    ───────────────────────────── */
    if (canSee) {
      visibleFrames.current++;
      invisibleFrames.current = 0;
    } else {
      invisibleFrames.current++;
      visibleFrames.current = 0;
    }

    if (visibleFrames.current >= REQUIRED_FRAMES) {
      isLookingRef.current = true;
      setLooking(true);
    }

    if (invisibleFrames.current >= REQUIRED_FRAMES) {
      isLookingRef.current = false;
      setLooking(false);
    }
  });

  return isLookingRef;
}
