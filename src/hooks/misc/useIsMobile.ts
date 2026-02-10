export function useIsMobile() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}
