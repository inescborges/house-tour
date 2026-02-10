import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useInteractable } from "@/hooks/gameplay/useInteractable";
import { useStore } from "@/state/useStore";

export function usePlayerRecordPlayer({
  movement,
  isDeadRef,
  onPromptChange,
  onPlay,
  onChange,
  onStop,
  soundRef,
}: {
  movement: any;
  isDeadRef: React.RefObject<boolean>;
  onPromptChange?: (prompt: string | null) => void;
  onPlay?: (index: number) => void;
  onChange?: (index: number) => void;
  onStop?: () => void;
  soundRef?: React.RefObject<THREE.PositionalAudio | null>;
}) {
  const {
    isRecordPlaying,
    currentRecordIndex,
    playRecord,
    changeRecord,
    stopRecord,
  } = useStore();

  const { activeRef } = useInteractable({
    targetName: "RecordPlayer",
    maxDistance: 2.2,
    enabled: true,
  });

  const lastPromptRef = useRef<string | null>(null);
  const enterHandledRef = useRef(false);
  const cHandledRef = useRef(false);

  // ─────────────────────────────
  // Audio positioning
  // ─────────────────────────────
  useEffect(() => {
    if (!activeRef.current) return;
    if (!soundRef?.current) return;

    const emitter = activeRef.current;

    // segurança extra
    if (!(emitter instanceof THREE.Object3D)) return;

    // evita re-anexar
    if (soundRef.current.parent === emitter) return;

    emitter.add(soundRef.current);
    soundRef.current.position.set(0, 0, 0);
  }, [activeRef.current, soundRef]);

  useFrame(() => {
    if (isDeadRef.current) return;

    const isFocused = !!activeRef.current;
    let prompt: string | null = null;

    if (isFocused) {
      if (!isRecordPlaying) prompt = "Play record";
      else prompt = "Change record / Turn off";
    }

    if (prompt !== lastPromptRef.current) {
      lastPromptRef.current = prompt;
      onPromptChange?.(prompt);
    }

    if (!isFocused) {
      if (lastPromptRef.current !== null) {
        lastPromptRef.current = null;
        onPromptChange?.(null);
      }
      return;
    }

    // Enter: toggle play / stop
    if (!movement.current.enter) {
      enterHandledRef.current = false;
    } else if (!enterHandledRef.current) {
      enterHandledRef.current = true;

      if (!isRecordPlaying) {
        playRecord();
        onPlay?.(currentRecordIndex);
      } else {
        stopRecord();
        onStop?.();
      }
    }

    // C: change record
    if (!movement.current.c) {
      cHandledRef.current = false;
    } else if (!cHandledRef.current && isRecordPlaying) {
      cHandledRef.current = true;
      changeRecord();
      onChange?.((currentRecordIndex + 1) % 3);
    }
  });
}
