export interface NarrativeSlice {
  currentDialogue: string | null;
  dialogueId: number;
  speak: (text: string) => void;
  clearDialogue: () => void;
}

export const createNarrativeSlice = (set: any): NarrativeSlice => ({
  currentDialogue: null,
  dialogueId: 0,

  speak: (text) =>
    set((state: NarrativeSlice) => ({
      currentDialogue: text,
      dialogueId: state.dialogueId + 1,
    })),

  clearDialogue: () => set({ currentDialogue: null }),
});
