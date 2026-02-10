import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export function usePointerLock() {
  const { gl } = useThree();
  const canvas = gl.domElement;

  const [locked, setLocked] = useState(false);

  // Block requests after ESC click
  const canRequestRef = useRef(true);

  useEffect(() => {
    if (!canvas) return;

    const requestLock = () => {
      if (!canRequestRef.current) return;
      if (document.pointerLockElement === canvas) return;

      canvas.requestPointerLock().catch(() => {});
    };

    const handleChange = () => {
      const isLocked = document.pointerLockElement === canvas;
      setLocked(isLocked);

      if (!isLocked) {
        canRequestRef.current = false;

        // Wait for the browser clear pending events
        setTimeout(() => {
          canRequestRef.current = true;
        }, 100);
      }
    };

    document.addEventListener("pointerdown", requestLock);
    document.addEventListener("pointerlockchange", handleChange);

    return () => {
      document.removeEventListener("pointerdown", requestLock);
      document.removeEventListener("pointerlockchange", handleChange);
    };
  }, [canvas]);

  return locked;
}
