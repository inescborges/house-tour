import { useEffect, useRef } from "react";

const VOWEL_MAP: Record<string, { pitch: number; dur: number }> = {
  a: { pitch: 1.0, dur: 160 },
  e: { pitch: 1.1, dur: 120 },
  i: { pitch: 1.25, dur: 90 },
  o: { pitch: 0.9, dur: 160 },
  u: { pitch: 0.8, dur: 180 },
};

export function useVowelVoice(
  text: string,
  enabled = true,
  voice: "host" | "other" = "host",
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const prevLength = useRef(0);
  const lastSoundTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Creates audio + context once
    if (!audioRef.current) {
      const audio = new Audio("/audio/cute-creature-sing-95585.mp3");
      audio.loop = true;

      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();

      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(ctx.destination);

      audio.play().catch(() => {
        /* autoplay bloqueado? ignora */
      });

      audioRef.current = audio;
      audioCtxRef.current = ctx;
      gainRef.current = gain;
    }

    // Reacts only to new characters
    if (text.length <= prevLength.current) {
      prevLength.current = text.length;
      return;
    }

    // Throttle to avoid cutting envelopes
    const nowMs = performance.now();
    if (nowMs - lastSoundTime.current < -5) {
      prevLength.current = text.length;
      return;
    }
    lastSoundTime.current = nowMs;

    const char = text[text.length - 1]?.toLowerCase();
    const vowel = VOWEL_MAP[char];

    if (!vowel) {
      prevLength.current = text.length;
      return;
    }

    const audio = audioRef.current!;
    const gain = gainRef.current!;
    const ctx = audioCtxRef.current!;

    const basePitch = voice === "host" ? 1.0 : 1.2;

    // Pitch with micro variation
    audio.playbackRate =
      vowel.pitch * basePitch * (0.97 + Math.random() * 0.06);

    const now = ctx.currentTime;

    gain.gain.cancelScheduledValues(now);

    // Fast fade in
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);

    // Soft fade out
    gain.gain.linearRampToValueAtTime(0, now + vowel.dur / 1000);

    prevLength.current = text.length;
  }, [text, enabled, voice]);
}
