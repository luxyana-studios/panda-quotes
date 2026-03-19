import { radius, spacing, typography } from "./tokens";

export const lightTheme = {
  colors: {
    background: "#e6e0d5",
    surface: "#ddd6c9",
    text: "#2d2a26",
    textSecondary: "#7a716a",
    primary: "#8b7355",
    primaryText: "#e6e0d5",
    border: "#7a716a",
    error: "#c4534a",
    success: "#7a8b6e",
    card: "#ece7dd",
    tabBar: "#e6e0d5",
    tabBarInactive: "#7a716a",
    accent: "#d4a574",
    secondary: "#a7c4a0",
    brandLight: "#faf7f2",
    brandDark: "#2d2a26",
    earthSand: "#e5ddd3",
    brandMuted: "#e8e2d9",
  },
  spacing,
  radius,
  typography,
} as const;

export const darkTheme = {
  colors: {
    background: "#2d2a26",
    surface: "#3a3632",
    text: "#faf7f2",
    textSecondary: "#c4b9ab",
    primary: "#d4a574",
    primaryText: "#2d2a26",
    border: "#4a453f",
    error: "#e07b73",
    success: "#a7c4a0",
    card: "#3a3632",
    tabBar: "#2d2a26",
    tabBarInactive: "#9b9388",
    accent: "#d4a574",
    secondary: "#a7c4a0",
    brandLight: "#faf7f2",
    brandDark: "#2d2a26",
    earthSand: "#4a453f",
    brandMuted: "#3a3632",
  },
  spacing,
  radius,
  typography,
} as const;

export type AppTheme = typeof lightTheme;
