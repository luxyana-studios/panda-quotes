import { Dimensions, Platform } from "react-native";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// Adaptive max-width based on viewport size — exported so _layout.tsx uses
// the exact same value that rs() was calculated against.
export const WEB_MAX_WIDTH: number =
  Platform.OS !== "web"
    ? 480 // not used on native, just a placeholder
    : WINDOW_WIDTH >= 1024
      ? 680 // large tablets / desktop
      : WINDOW_WIDTH >= 768
        ? 600 // iPad portrait
        : 480; // phones

// Allow more growth headroom on larger containers
const maxScale =
  WEB_MAX_WIDTH >= 680 ? 1.25 : WEB_MAX_WIDTH >= 600 ? 1.2 : 1.15;

// Effective rendered width (accounts for web container cap)
const effectiveWidth =
  Platform.OS === "web" ? Math.min(WINDOW_WIDTH, WEB_MAX_WIDTH) : WINDOW_WIDTH;

// Design base is 390px (iPhone 14 Pro)
const BASE_WIDTH = 390;
const ratio = effectiveWidth / BASE_WIDTH;

/**
 * Responsive scale — scales a value designed for a 390px-wide screen
 * to the current device/viewport. Clamped to [0.82, maxScale].
 *
 * maxScale by container:
 *  480px (phone web / native phone)  → 1.15×
 *  600px (iPad portrait)             → 1.20×
 *  680px (iPad landscape / desktop)  → 1.25×
 */
export const rs = (size: number): number =>
  Math.round(size * Math.max(0.82, Math.min(ratio, maxScale)));

export { WINDOW_HEIGHT };
