export interface ControlSlice {
  controlsLocked: boolean;
  lockControls: () => void;
  unlockControls: () => void;
}

export const createControlSlice = (set: any) => ({
  controlsLocked: false,
  lockControls: () => set({ controlsLocked: true }),
  unlockControls: () => set({ controlsLocked: false }),
});
