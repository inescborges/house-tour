export interface PromptSlice {
  currentPrompt: string | null;
  setPrompt: (p: string | null) => void;
  clearPrompt: () => void;
}

export const createPromptSlice = (set: any): PromptSlice => ({
  currentPrompt: null,

  setPrompt: (p) => set({ currentPrompt: p }),

  clearPrompt: () => set({ currentPrompt: null }),
});
