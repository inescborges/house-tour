export interface RecordPlayerSlice {
  isRecordPlaying: boolean;
  currentRecordIndex: number;
  playRecord: () => void;
  changeRecord: () => void;
  stopRecord: () => void;
}

export const createRecordPlayerSlice = (set: any) => ({
  isRecordPlaying: false,
  currentRecordIndex: 0,

  playRecord: () => set({ isRecordPlaying: true }),

  changeRecord: () =>
    set((s: any) => ({
      currentRecordIndex: (s.currentRecordIndex + 1) % 3,
    })),

  stopRecord: () => set({ isRecordPlaying: false }),
});
