import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

export function useDemonLightFlicker(
  ambientRef: RefObject<THREE.AmbientLight | null>,
  hemiRef: RefObject<THREE.HemisphereLight | null>,
  dirRef: RefObject<THREE.DirectionalLight | null>,
  isLookingRef: RefObject<boolean>,
) {
  // Normal light
  const normalAmbient = 0.4;
  const normalHemi = 0.6;
  const normalDir = 1;

  // Corrupted light
  const corruptAmbient = 0.25;
  const corruptHemi = 0.35;
  const corruptDir = 0.7;

  const ambientCurrent = useRef(normalAmbient);
  const ambientTarget = useRef(normalAmbient);
  const timer = useRef(0);

  useFrame((_, delta) => {
    const ambient = ambientRef.current;
    const hemi = hemiRef.current;
    const dir = dirRef.current;

    if (!ambient || !hemi || !dir) return;

    if (isLookingRef.current) {
      // Unstable world
      timer.current -= delta;

      if (timer.current <= 0) {
        // Short blackout
        if (Math.random() < 0.12) {
          ambientTarget.current = 0.04;
          hemi.intensity = 0.08;
          dir.intensity = 0.12;
        } else {
          ambientTarget.current =
            corruptAmbient + THREE.MathUtils.randFloat(-0.15, 0.08);

          hemi.intensity = corruptHemi + THREE.MathUtils.randFloat(-0.2, 0.1);

          dir.intensity = corruptDir * (0.3 + Math.random() * 0.4);
        }

        timer.current = THREE.MathUtils.randFloat(0.12, 0.45);
      }

      ambientCurrent.current = THREE.MathUtils.lerp(
        ambientCurrent.current,
        ambientTarget.current,
        0.35,
      );

      ambient.intensity = THREE.MathUtils.clamp(
        ambientCurrent.current,
        0.03,
        0.6,
      );
    } else {
      // Recovery to normal world
      ambientCurrent.current = THREE.MathUtils.lerp(
        ambientCurrent.current,
        normalAmbient,
        0.08,
      );

      ambient.intensity = ambientCurrent.current;
      hemi.intensity = THREE.MathUtils.lerp(hemi.intensity, normalHemi, 0.08);
      dir.intensity = THREE.MathUtils.lerp(dir.intensity, normalDir, 0.08);

      // Security reset
      ambientTarget.current = normalAmbient;
      timer.current = 0;
    }
  });
}
