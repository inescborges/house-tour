import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "@/state/useStore";

export function useMouseLook(
  targetRot: React.RefObject<{ x: number; y: number }>,
  enabled: boolean,
  sensitivity: number = 0.002,
) {
  const { gl } = useThree();
  const canvas = gl.domElement;

  const controlsLocked = useStore((s) => s.controlsLocked);

  useEffect(() => {
    if (!enabled) return;
    if (!targetRot.current) return;

    /**
     * Pointer-lock mouse movement handler.
     * Applies delta movement directly to yaw/pitch target rotations.
     */
    const onMove = (e: MouseEvent) => {
      // Ignore events if pointer lock was lost mid-frame
      if (document.pointerLockElement !== canvas) return;

      // Global player lock
      if (controlsLocked) return;

      const rot = targetRot.current;

      rot.y -= e.movementX * sensitivity;
      rot.x -= e.movementY * sensitivity;

      // Clamp vertical angle (pitch)
      const maxPitch = Math.PI / 2;
      rot.x = Math.max(-maxPitch, Math.min(maxPitch, rot.x));
    };

    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, [enabled, targetRot, sensitivity, controlsLocked]);
}
