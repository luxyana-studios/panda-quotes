import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";
import { deviceSuggestedLanguage } from "@/core/i18n";
import { useSettingsStore } from "@/features/settings/stores/settings.store";

interface LanguageScreenProps {
  onNext: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
] as const;

export function LanguageScreen({ onNext }: LanguageScreenProps) {
  const { t } = useTranslation();
  const { setLanguage } = useSettingsStore();
  const [selected, setSelected] = useState(deviceSuggestedLanguage);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reanimated shared values are stable refs
  useEffect(() => {
    const timer = setTimeout(() => {
      const dur = 700;
      titleOpacity.value = withTiming(1, { duration: dur, easing: EASE_OUT });
      titleTranslateY.value = withTiming(0, {
        duration: dur,
        easing: EASE_OUT,
      });
      listOpacity.value = withDelay(
        200,
        withTiming(1, { duration: dur, easing: EASE_OUT }),
      );
      listTranslateY.value = withDelay(
        200,
        withTiming(0, { duration: dur, easing: EASE_OUT }),
      );
      buttonOpacity.value = withDelay(
        400,
        withTiming(1, { duration: dur, easing: EASE_OUT }),
      );
      buttonTranslateY.value = withDelay(
        400,
        withTiming(0, { duration: dur, easing: EASE_OUT }),
      );
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (code: string) => {
    setSelected(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />

      <View style={styles.content}>
        <Animated.Text style={[styles.title, titleStyle]}>
          {t("onboarding.language.title")}
        </Animated.Text>

        <Animated.View style={[styles.list, listStyle]}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {LANGUAGES.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(lang.code)}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>
              {t("onboarding.language.continue")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandAccent,
  },
  topDecoration: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 32,
  },
  list: {
    width: "100%",
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 14,
  },
  optionSelected: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "rgba(255,255,255,0.5)",
  },
  flag: {
    fontSize: 24,
  },
  optionLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  optionLabelSelected: {
    color: colors.brandDark,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.brandAccent,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 32,
  },
  continueButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    color: colors.brandDark,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
