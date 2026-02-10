export interface SleepSlice {
  isSleeping: boolean;
  startSleep: () => void;
  wakeUp: () => void;
}

export const createSleepSlice = (set: any) => ({
  isSleeping: false,
  startSleep: () => set({ isSleeping: true }),
  wakeUp: () => set({ isSleeping: false }),
});
