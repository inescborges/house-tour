import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function usePlayerCameraRig(
  camera: THREE.Camera,
  scene: THREE.Scene,
  spawnPosition: THREE.Vector3
) {
  const yawObject = useMemo(() => new THREE.Object3D(), []);
  const pitchObject = useMemo(() => new THREE.Object3D(), []);

  const targetRot = useRef({ x: 0.15, y: 0 });

  useLayoutEffect(() => {
    yawObject.add(pitchObject);
    pitchObject.add(camera);
    scene.add(yawObject);

    camera.position.set(0, 1.55, 0);
    yawObject.position.copy(spawnPosition);

    return () => {
      scene.remove(yawObject);
    };
  }, [camera, scene, yawObject, pitchObject, spawnPosition]);

  return {
    yawObject,
    pitchObject,
    targetRot,
  };
}
