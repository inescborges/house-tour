export interface LifeSlice {
  isDead: boolean;
  isLookingAtDemon: boolean;
  setLookingAtDemon: (v: boolean) => void;
  die: () => void;
}

export const createLifeSlice = (set: any): LifeSlice => ({
  isDead: false,
  isLookingAtDemon: false,
  die: () => set({ isDead: true }),
  setLookingAtDemon: (v: boolean) => set({ isLookingAtDemon: v }),
});
