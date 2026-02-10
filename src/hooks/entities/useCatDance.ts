import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/state/useStore";
import { useRef } from "react";

export function useCatDance() {
  const { scene } = useThree();
  const isRecordPlaying = useStore((s) => s.isRecordPlaying);

  const catRefs = useRef<(THREE.Object3D | null)[]>([null, null]);

  const sofaPositions = useRef<(THREE.Vector3 | null)[]>([null, null]);
  const dancePositions = useRef<(THREE.Vector3 | null)[]>([null, null]);

  useFrame(({ clock }) => {
    // ─────────────────────────────
    // Init
    // ─────────────────────────────
    if (!catRefs.current[0]) {
      const c1 = scene.getObjectByName("Cat001");
      const c2 = scene.getObjectByName("Cat002");
      const couch = scene.getObjectByName("Couch");

      if (!c1 || !c2 || !couch) return;

      // Save original positions
      dancePositions.current = [c1.position.clone(), c2.position.clone()];

      // ─────────────────────────────
      // Place on couch
      // ─────────────────────────────
      const box = new THREE.Box3().setFromObject(couch);
      const center = box.getCenter(new THREE.Vector3());
      const sofaTopY = box.max.y;

      const spacing = 0.5;
      const insetZ = -0.55;
      const cushionLift = 0.25;

      c1.position.set(
        center.x - spacing,
        sofaTopY + cushionLift,
        center.z - insetZ,
      );

      c2.position.set(
        center.x + spacing,
        sofaTopY + cushionLift,
        center.z - insetZ,
      );

      c1.rotation.y = Math.PI * 0.4;
      c2.rotation.y = Math.PI * 0.6;

      sofaPositions.current = [c1.position.clone(), c2.position.clone()];

      catRefs.current = [c1, c2];
    }

    const t = clock.elapsedTime;

    // ─────────────────────────────
    // Music off -> Couch
    // ─────────────────────────────
    if (!isRecordPlaying) {
      catRefs.current.forEach((cat, i) => {
        const target = sofaPositions.current[i];
        if (!cat || !target) return;

        cat.position.lerp(target, 0.08);
        cat.rotation.y *= 0.9;
      });
      return;
    }

    // ─────────────────────────────
    // Music on -> Dance positions
    // ─────────────────────────────
    catRefs.current.forEach((cat, i) => {
      const base = dancePositions.current[i];
      if (!cat || !base) return;

      const offset = i * Math.PI;

      // Come back to original position
      cat.position.lerp(base, 0.08);

      // Soft bob
      const bob = Math.sin(t * 6 + offset) * 0.08;
      cat.position.y = base.y + Math.max(0, bob);

      // Rythmic rotation
      cat.rotation.y = Math.sin(t * 4 + offset) * 0.6;
    });
  });
}
