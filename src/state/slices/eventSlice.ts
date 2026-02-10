export interface EventSlice {
  lastEvent: string | null;
  triggerEvent: (event: string) => void;
}

export const createEventSlice = (set: any): EventSlice => ({
  lastEvent: null,
  triggerEvent: (event) => set({ lastEvent: event }),
});
