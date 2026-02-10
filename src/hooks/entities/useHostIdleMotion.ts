import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function useHostIdleMotion() {
  const { scene, camera } = useThree();

  const hostRef = useRef<THREE.Object3D | null>(null);
  const basePos = useRef<THREE.Vector3 | null>(null);

  const state = useRef<"idle" | "sway" | "settle">("idle");
  const t = useRef(0);

  useFrame((_, delta) => {
    if (!hostRef.current) {
      const host = scene.getObjectByName("Host_INSTANCE");
      if (!host) return;

      hostRef.current = host;
      basePos.current = host.position.clone();
      return;
    }

    const host = hostRef.current;
    const base = basePos.current;
    if (!host || !base) return;

    const hostPos = new THREE.Vector3();
    const camPos = new THREE.Vector3();

    host.getWorldPosition(hostPos);
    camera.getWorldPosition(camPos);

    host.rotation.y = Math.atan2(camPos.x - hostPos.x, camPos.z - hostPos.z);

    if (state.current === "idle") {
      // Wait still
      t.current += delta;
      if (t.current > 2.5) {
        t.current = 0;
        state.current = "sway";
      }
    } else if (state.current === "sway") {
      // Active swinging motion
      t.current += delta;

      const lean = Math.sin(t.current * 3.6);

      host.rotation.z = lean * 0.18;
      host.position.y = base.y + Math.abs(lean) * 0.035;

      // After 4 swings -> rest
      if (t.current > Math.PI / 1.2) {
        state.current = "settle";
      }
    } else if (state.current === "settle") {
      // Settle all axis
      host.rotation.z += (0 - host.rotation.z) * 0.08;
      host.position.y += (base.y - host.position.y) * 0.08;

      // When it's almost there -> idle
      if (
        Math.abs(host.rotation.z) < 0.001 &&
        Math.abs(host.position.y - base.y) < 0.001
      ) {
        host.rotation.z = 0;
        host.position.y = base.y;
        t.current = 0;
        state.current = "idle";
      }
    }
  });
}
