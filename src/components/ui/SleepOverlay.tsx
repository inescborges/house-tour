import { useStore } from "@/state/useStore";

export function SleepOverlay() {
  const isSleeping = useStore((s) => s.isSleeping);
  if (!isSleeping) return null;

  return (
    <>
      {/* 1️⃣ BLUR PROGRESSIVO */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2700,
          animation: "sleepBlur 1s linear forwards",
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      />

      {/* 2️⃣ TOP EYELID */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "75%",
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,0.9) 45%,
              rgba(0,0,0,0.5) 70%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0) 100%
            )
          `,
          transformOrigin: "top",
          animation: "eyeClose 1s linear forwards",
          pointerEvents: "none",
          zIndex: 3000,
        }}
      />

      {/* 2️⃣ BOTTOM EYELID */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "75%",
          background: `
            linear-gradient(
              to top,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,0.9) 45%,
              rgba(0,0,0,0.5) 70%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0) 100%
            )
          `,
          transformOrigin: "bottom",
          animation: "eyeClose 1s linear forwards",
          pointerEvents: "none",
          zIndex: 3000,
        }}
      />

      {/* 3️⃣ BLACKOUT FINAL */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "black",
          opacity: 0,
          animation: "finalBlack 0.6s linear forwards",
          animationDelay: ".6s",
          pointerEvents: "none",
          zIndex: 3500,
        }}
      />

      <style>
        {`
          @keyframes eyeClose {
            from { transform: scaleY(0); }
            to   { transform: scaleY(1); }
          }

          @keyframes sleepBlur {
            from {
              backdrop-filter: blur(0px);
              -webkit-backdrop-filter: blur(0px);
            }
            to {
              backdrop-filter: blur(22px);
              -webkit-backdrop-filter: blur(22px);
            }
          }

          @keyframes finalBlack {
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
