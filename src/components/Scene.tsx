import { useOpenEntranceDoor } from "@/hooks/doors/useOpenEntranceDoor";
import House from "./House";
import { useEffect, useRef } from "react";
import { useOpenInteriorDoors } from "@/hooks/doors/useOpenInteriorDoors";
import { useCatDance } from "@/hooks/entities/useCatDance";
import { useHostIdleMotion } from "@/hooks/entities/useHostIdleMotion";
import * as THREE from "three";
import { useStore } from "@/state/useStore";
import { useDemonLightFlicker } from "@/hooks/entities/useDemonLightFlicker";

interface SceneProps {
  shouldOpenDoor: boolean;
}

export default function Scene({ shouldOpenDoor }: SceneProps) {
  const shouldOpenDoorRef = useRef(false);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const isLookingAtDemon = useStore((s) => s.isLookingAtDemon);

  useEffect(() => {
    shouldOpenDoorRef.current = shouldOpenDoor;
  }, [shouldOpenDoor]);

  useOpenEntranceDoor(shouldOpenDoorRef);
  useOpenInteriorDoors();

  useCatDance();
  useHostIdleMotion();
  useDemonLightFlicker(ambientRef, hemiRef, dirRef, {
    current: isLookingAtDemon,
  });

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={0.4} />

      <hemisphereLight
        ref={hemiRef}
        color={"#ffffff"}
        groundColor={"#444444"}
        intensity={0.6}
      />

      <directionalLight
        ref={dirRef}
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />

      <House position={[0, 0, 0]} />
    </group>
  );
}
