import { useStore } from "@/state/useStore";
import { useFrame } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

export interface FPSControlsParams {
  yawObject: THREE.Object3D;
  pitchObject: THREE.Object3D;
  camera: THREE.Camera;
  scene: THREE.Scene;
  movement: React.RefObject<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  }>;
  targetRot: React.RefObject<{ x: number; y: number }>;
  isDeadRef?: React.RefObject<boolean>;
  playerFootstepsRef?: React.RefObject<THREE.Audio | null>;
}

/**
 * FPS controller:
 * - rotation (yaw / pitch)
 * - movement
 * - head bobbing
 * - collision
 * - footsteps audio
 */
export function useFPSControls({
  yawObject,
  pitchObject,
  camera,
  scene,
  movement,
  targetRot,
  isDeadRef,
  playerFootstepsRef,
}: FPSControlsParams) {
  const BASE_HEIGHT = 1.6;
  const SPEED = 3;
  const COLLISION_DISTANCE = 0.6;

  const bobbingRef = React.useRef(0);
  const raycaster = new THREE.Raycaster();

  /* ─────────────────────────────
     Lock controls
  ───────────────────────────── */
  const controlsLocked = useStore((s) => s.controlsLocked);

  /* ─────────────────────────────
     Rotation
  ───────────────────────────── */
  const applyRotation = () => {
    const smoothing = 0.08;

    yawObject.rotation.y +=
      (targetRot.current.y - yawObject.rotation.y) * smoothing;

    pitchObject.rotation.x +=
      (targetRot.current.x - pitchObject.rotation.x) * smoothing;
  };

  /* ─────────────────────────────
     Movement vector (WASD)
  ───────────────────────────── */
  const getMovementVector = (): THREE.Vector3 => {
    if (!movement.current) return new THREE.Vector3();

    const { forward, backward, left, right } = movement.current;
    const velocity = new THREE.Vector3();

    // Forward direction
    const forwardDir = new THREE.Vector3();
    yawObject.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize().negate();

    // Right direction
    const rightDir = new THREE.Vector3();
    rightDir.crossVectors(forwardDir, new THREE.Vector3(0, 1, 0)).normalize();

    if (forward) velocity.add(forwardDir);
    if (backward) velocity.add(forwardDir.clone().negate());
    if (left) velocity.add(rightDir.clone().negate());
    if (right) velocity.add(rightDir);

    return velocity;
  };

  /* ─────────────────────────────
     Head bobbing
  ───────────────────────────── */
  const applyHeadBobbing = (isMoving: boolean, delta: number) => {
    if (isMoving) {
      bobbingRef.current += delta * 10;
      camera.position.y = BASE_HEIGHT + Math.sin(bobbingRef.current) * 0.05;
    } else {
      camera.position.y += (BASE_HEIGHT - camera.position.y) * 0.1;
    }
  };

  /* ─────────────────────────────
     Collision
  ───────────────────────────── */
  const isPathClear = (direction: THREE.Vector3): boolean => {
    raycaster.set(
      camera.getWorldPosition(new THREE.Vector3()),
      direction.clone().normalize(),
    );

    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.length === 0 || hits[0].distance > COLLISION_DISTANCE;
  };

  /* ─────────────────────────────
     Apply movement
  ───────────────────────────── */
  const applyMovement = (velocity: THREE.Vector3, delta: number) => {
    const step = velocity.normalize().multiplyScalar(SPEED * delta);

    if (isPathClear(step)) {
      yawObject.position.add(step);
    }
  };

  /* ─────────────────────────────
     Frame loop
  ───────────────────────────── */
  useFrame((_, delta) => {
    const footsteps = playerFootstepsRef?.current;

    // Freeze player on death
    if (isDeadRef?.current) {
      footsteps?.stop();
      return;
    }

    // Freeze player if controls are locked
    if (controlsLocked) {
      footsteps?.stop();
      return;
    }

    // Rotation
    applyRotation();

    // Movement
    const velocity = getMovementVector();
    const isMoving = velocity.lengthSq() > 0;

    // Head bobbing
    applyHeadBobbing(isMoving, delta);

    // Translation
    if (isMoving) {
      applyMovement(velocity, delta);
    }

    // Footsteps audio control
    if (footsteps) {
      if (isMoving && !footsteps.isPlaying) {
        footsteps.play();
      }

      if (!isMoving && footsteps.isPlaying) {
        footsteps.stop();
      }
    }
  });
}
