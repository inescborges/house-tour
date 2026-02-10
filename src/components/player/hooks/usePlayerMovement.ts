import { useFPSControls } from "@/hooks/controls/useFPSControls";
import * as THREE from "three";

export function usePlayerMovement(props: {
  yawObject: THREE.Object3D;
  pitchObject: THREE.Object3D;
  camera: THREE.Camera;
  scene: THREE.Scene;
  movement: any;
  targetRot: React.RefObject<{ x: number; y: number }>;
  isDeadRef: React.RefObject<boolean>;
  playerFootstepsRef?: React.RefObject<THREE.Audio | null>;
}) {
  useFPSControls(props);
}
