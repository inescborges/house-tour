// ─────────────────────────────
// React / R3F
// ─────────────────────────────
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────
// State
// ─────────────────────────────
import { useStore } from "@/state/useStore";

// ─────────────────────────────
// Input
// ─────────────────────────────
import { useKeyboard } from "@/hooks/controls/useKeyboard";
import { usePointerLock } from "@/hooks/controls/usePointerLock";
import { useMouseLook } from "@/hooks/controls/useMouseLook";

// ─────────────────────────────
// Player systems
// ─────────────────────────────
import { usePlayerCameraRig } from "./hooks/usePlayerCameraRig";
import { usePlayerHostAudio } from "./hooks/usePlayerHostAudio";
import { usePlayerLifecycle } from "./hooks/usePlayerLifecycle";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerDemon } from "./hooks/usePlayerDemon";
import { usePlayerInteriorDoors } from "./hooks/usePlayerInteriorDoors";
import { usePlayerHostDoorbell } from "./hooks/usePlayerHostDoorbell";
import { usePlayerRecordPlayer } from "./hooks/usePlayerRecordPlayer";

// ─────────────────────────────
// Gameplay audio
// ─────────────────────────────
import { useRecordPlayerAudio } from "@/hooks/gameplay/useRecordPlayerAudio";
import { usePlayerBed } from "./hooks/usePlayerBed";
import { useFootstepsAudio } from "@/hooks/audio/useFootstepsAudio";
import { usePlayerHostDialogue } from "./hooks/usePlayerHostDialogue";

interface PlayerProps {
  onDeath: () => void;
  onDoorbellFocus?: (canRing: boolean) => void;
  onDoorbellRing?: () => void;
  onEntranceDoorOpen: () => void;
}

export default function Player({
  onDeath,
  onDoorbellFocus,
  onDoorbellRing,
  onEntranceDoorOpen,
}: PlayerProps) {
  // ─────────────────────────────
  // Three.js context
  // ─────────────────────────────
  const { camera, scene } = useThree();

  // ─────────────────────────────
  // Spawn
  // ─────────────────────────────
  const spawnPosition = useMemo(() => new THREE.Vector3(-2.4597, 0, 1), []);

  // ─────────────────────────────
  // Input
  // ─────────────────────────────
  const movement = useKeyboard();
  const locked = usePointerLock();

  // ─────────────────────────────
  // Camera rig
  // ─────────────────────────────
  const { yawObject, pitchObject, targetRot } = usePlayerCameraRig(
    camera,
    scene,
    spawnPosition,
  );

  useMouseLook(targetRot, locked);

  // Doorbell audio
  const { doorbellSoundRef } = usePlayerHostAudio(camera);

  // Footsteps audio for player and host
  const playerFootstepsRef = useFootstepsAudio(camera);
  const hostFootstepsRef = useFootstepsAudio(camera);

  // Record player audio
  const { soundRef, playTrack, stopTrack } = useRecordPlayerAudio(camera);

  // Lifecycle (death / reset)
  const { isDeadRef, killPlayer } = usePlayerLifecycle({
    onDeath,
    onDoorbellFocus,
  });

  // ─────────────────────────────
  // Player movement
  // ─────────────────────────────
  usePlayerMovement({
    yawObject,
    pitchObject,
    camera,
    scene,
    movement,
    targetRot,
    isDeadRef,
    playerFootstepsRef,
  });

  // ─────────────────────────────
  // Demon interaction
  // ─────────────────────────────
  usePlayerDemon({
    onKill: killPlayer,
  });

  // ─────────────────────────────
  // Interior doors interaction
  // ─────────────────────────────
  usePlayerInteriorDoors({
    movement,
    locked,
    onDoorbellFocus,
  });

  // ─────────────────────────────
  // Doorbell interaction
  // ─────────────────────────────
  usePlayerHostDoorbell({
    movement,
    isDeadRef,
    doorbellSoundRef,
    hostFootstepsRef,
    onDoorbellFocus,
    onDoorbellRing,
    onEntranceDoorOpen,
  });

  // ─────────────────────────────
  // Record player interaction
  // ─────────────────────────────
  const setPrompt = useStore((s) => s.setPrompt);

  usePlayerRecordPlayer({
    movement,
    isDeadRef,
    onPromptChange: setPrompt,
    soundRef, // 👈 passa o som
    onPlay: playTrack,
    onChange: (i) => {
      stopTrack();
      playTrack(i);
    },
    onStop: stopTrack,
  });

  // ─────────────────────────────
  // Bed interaction
  // ─────────────────────────────
  usePlayerBed({
    movement,
    isDeadRef,
    onPromptChange: setPrompt,
  });

  // ─────────────────────────────
  // Host interaction
  // ─────────────────────────────
  usePlayerHostDialogue({
    movement,
    isDeadRef,
    onPromptChange: setPrompt,
  });

  return null;
}
