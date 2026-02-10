export interface DoorSlice {
  canRingDoorbell: boolean;
  hasRungDoorbell: boolean;
  shouldOpenDoor: boolean;

  interiorDoorToOpen: string | null;
  interiorDoorEvent: string | null;

  openedInteriorDoors: Set<string>;

  allowDoorbell: (value: boolean) => void;
  ringDoorbell: () => void;
  openEntranceDoor: () => void;

  focusInteriorDoor: (name: string | null) => void;
  openInteriorDoor: () => void;
  markInteriorDoorOpened: (name: string) => void;
}

export const createDoorSlice = (set: any): DoorSlice => ({
  canRingDoorbell: false,
  hasRungDoorbell: false,
  shouldOpenDoor: false,

  interiorDoorToOpen: null,
  interiorDoorEvent: null,
  openedInteriorDoors: new Set(),

  allowDoorbell: (value) => set({ canRingDoorbell: value }),
  ringDoorbell: () => set({ hasRungDoorbell: true }),
  openEntranceDoor: () => set({ shouldOpenDoor: true }),

  focusInteriorDoor: (name) =>
    set((state: any) => {
      if (name && state.openedInteriorDoors.has(name)) {
        return { interiorDoorToOpen: null };
      }
      return { interiorDoorToOpen: name };
    }),

  openInteriorDoor: () =>
    set((state: DoorSlice) => ({
      interiorDoorEvent: state.interiorDoorToOpen,
    })),

  markInteriorDoorOpened: (name) =>
    set((state: DoorSlice) => ({
      openedInteriorDoors: new Set(state.openedInteriorDoors).add(name),
      interiorDoorToOpen: null,
      interiorDoorEvent: null,
    })),
});
