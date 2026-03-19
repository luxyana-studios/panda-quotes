import { UnistylesRuntime } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "@/core/i18n";
import { zustandMMKVStorage } from "@/core/storage/mmkv";

type ThemeMode = "system" | "light" | "dark";

export interface SettingsState {
  themeMode: ThemeMode;
  language: string;
  onboardingCompleted: boolean;
  selectedCategories: string[];
  notificationEnabled: boolean;
  notificationFrequency: number;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: string) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setSelectedCategories: (cats: string[]) => void;
  setNotificationPrefs: (enabled: boolean, frequency: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: "system",
      language: i18n.language,
      onboardingCompleted: false,
      selectedCategories: [],
      notificationEnabled: false,
      notificationFrequency: 3,

      setThemeMode: (mode) => {
        if (mode === "system") {
          UnistylesRuntime.setAdaptiveThemes(true);
        } else {
          UnistylesRuntime.setAdaptiveThemes(false);
          UnistylesRuntime.setTheme(mode);
        }
        set({ themeMode: mode });
      },

      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),

      setSelectedCategories: (cats) => set({ selectedCategories: cats }),

      setNotificationPrefs: (enabled, frequency) =>
        set({ notificationEnabled: enabled, notificationFrequency: frequency }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setThemeMode(state.themeMode);
      },
    },
  ),
);
