import { useEffect, useRef, useState } from "react";
import { useStore } from "@/state/useStore";

const VIDEO_START_DELAY = 1300;

export function DreamVideoOverlay() {
  const isSleeping = useStore((s) => s.isSleeping);
  const setPrompt = useStore((s) => s.setPrompt);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPromptRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isSleeping) {
      setMounted(false);

      if (lastPromptRef.current !== null) {
        lastPromptRef.current = null;
        setPrompt(null);
      }

      return;
    }

    const t = setTimeout(() => {
      setMounted(true);
    }, VIDEO_START_DELAY);

    return () => clearTimeout(t);
  }, [isSleeping, setPrompt]);

  useEffect(() => {
    if (!mounted) return;

    const prompt = "Wake up";

    if (prompt !== lastPromptRef.current) {
      lastPromptRef.current = prompt;
      setPrompt(prompt);
    }

    return () => {
      if (lastPromptRef.current !== null) {
        lastPromptRef.current = null;
        setPrompt(null);
      }
    };
  }, [mounted, setPrompt]);

  useEffect(() => {
    if (!mounted) return;
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <video
        ref={videoRef}
        loop
        playsInline
        src="/video/Wladyslaw_Starewicz_The_Dragonfly_And_The_Ant.mp4"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 4000,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "black",
          animation: "dreamFadeOut 6s linear forwards",
          zIndex: 4100,
          pointerEvents: "none",
        }}
      />

      <style>
        {`
          @keyframes dreamFadeOut {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
        `}
      </style>
    </>
  );
}
