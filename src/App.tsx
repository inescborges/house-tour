import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./components/Scene";
import Player from "./components/player/Player";
import { DeathOverlay } from "./components/ui/DeathOverlay";
import { useRetryOnEnter } from "./hooks/misc/useRetryOnEnter";
import { useStore } from "./state/useStore";
import { useNarrative } from "./hooks/narrative/useNarrative";
import { DoorbellPrompt } from "./components/ui/DoorbellPrompt";
import { InteriorDoorPrompt } from "./components/ui/InteriorDoorPrompt";
import { DialogueBox } from "./components/ui/DialogueBox";
import { RecordPlayerPrompt } from "./components/ui/RecordPlayerPrompt";
import { BedPrompt } from "./components/ui/BedOverlay";
import { SleepOverlay } from "./components/ui/SleepOverlay";
import { DreamVideoOverlay } from "./components/ui/DreamVideoOverlay";
import { WakeUpPrompt } from "./components/ui/WakeUpOverlay";
import { HostPrompt } from "./components/ui/HostPrompt";
import { useIsMobile } from "./hooks/misc/useIsMobile";
import { MobileBlocker } from "./components/ui/MobileBlocker";

export default function App() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileBlocker />;
  }

  const store = useStore();
  const {
    isDead,
    canRingDoorbell,
    interiorDoorToOpen,
    hasRungDoorbell,
    shouldOpenDoor,
    die,
    allowDoorbell,
    ringDoorbell,
    openEntranceDoor,
  } = store;

  useRetryOnEnter(isDead, () => window.location.reload());
  useNarrative();

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{
          position: [0, 1.6, 5],
          fov: 42,
          near: 0.2,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <Scene shouldOpenDoor={shouldOpenDoor} />

          <Player
            onDeath={die}
            onDoorbellFocus={allowDoorbell}
            onDoorbellRing={ringDoorbell}
            onEntranceDoorOpen={openEntranceDoor}
          />
        </Suspense>
      </Canvas>

      {/* UI */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        {isDead && <DeathOverlay />}
        <DialogueBox />
        <SleepOverlay />
        <DreamVideoOverlay />
        {canRingDoorbell && !hasRungDoorbell && !isDead && <DoorbellPrompt />}
        {interiorDoorToOpen && <InteriorDoorPrompt />}
        <RecordPlayerPrompt />
        <BedPrompt />
        <WakeUpPrompt />
        <HostPrompt />
      </div>
    </div>
  );
}
