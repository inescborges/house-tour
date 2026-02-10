import { create } from "zustand";

import { createLifeSlice } from "./slices/lifeSlice";
import { createNarrativeSlice } from "./slices/narrativeSlice";
import { createDoorSlice } from "./slices/doorSlice";
import { createEventSlice } from "./slices/eventSlice";

import type { LifeSlice } from "./slices/lifeSlice";
import type { NarrativeSlice } from "./slices/narrativeSlice";
import type { DoorSlice } from "./slices/doorSlice";
import type { EventSlice } from "./slices/eventSlice";
import {
  createRecordPlayerSlice,
  type RecordPlayerSlice,
} from "./slices/recordPlayerSlice";
import { createPromptSlice, type PromptSlice } from "./slices/promptSlice";
import { createSleepSlice, type SleepSlice } from "./slices/sleepSlice";
import { createControlSlice, type ControlSlice } from "./slices/controlsSlice";

type GameStore = LifeSlice &
  NarrativeSlice &
  DoorSlice &
  EventSlice &
  RecordPlayerSlice &
  PromptSlice &
  SleepSlice &
  ControlSlice & {
    reset: () => void;
  };

export const useStore = create<GameStore>((set) => ({
  ...createLifeSlice(set),
  ...createNarrativeSlice(set),
  ...createDoorSlice(set),
  ...createEventSlice(set),
  ...createRecordPlayerSlice(set),
  ...createPromptSlice(set),
  ...createSleepSlice(set),
  ...createControlSlice(set),

  reset: () =>
    set({
      // life
      isDead: false,

      // doorbell / doors
      canRingDoorbell: false,
      hasRungDoorbell: false,
      shouldOpenDoor: false,
      interiorDoorToOpen: null,
      interiorDoorEvent: null,
      openedInteriorDoors: new Set(),

      // narrative
      currentDialogue: null,

      // prompt
      currentPrompt: null,

      // record player
      isRecordPlaying: false,
      currentRecordIndex: 0,

      // bed
      isSleeping: false,

      // controls
      controlsLocked: false,
    }),
}));
