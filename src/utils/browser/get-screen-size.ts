export enum ScreenSizeEnum {
  xs = 0,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
}
export const getScreenSize = (): ScreenSizeEnum => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches
  ) {
    return ScreenSizeEnum.xs; // Extra Small
  } else if (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 640px) and (max-width: 767px)").matches
  ) {
    return ScreenSizeEnum.sm; // Small
  } else if (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches
  ) {
    return ScreenSizeEnum.md; // Medium
  } else if (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px) and (max-width: 1279px)").matches
  ) {
    return ScreenSizeEnum.lg; // Large
  } else if (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1280px)").matches
  ) {
    return ScreenSizeEnum.xl; // Extra Large
  } else {
    return ScreenSizeEnum.xl; // Por si algún tamaño no coincide
  }
};
