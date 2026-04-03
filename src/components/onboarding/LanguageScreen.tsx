import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";
import { LANGUAGES } from "@/constants/languages";
import { deviceSuggestedLanguage } from "@/core/i18n";
import { rs } from "@/core/theme/responsive";
import { useSettingsStore } from "@/features/settings/stores/settings.store";

interface LanguageScreenProps {
  onNext: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

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
    paddingHorizontal: 32,
    paddingTop: Platform.select({ web: 40, default: 56 }),
    paddingBottom: 24,
  },
  title: {
    fontSize: rs(28),
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: rs(24),
  },
  list: {
    flex: 1,
    width: "100%",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: rs(18),
    paddingVertical: rs(16),
    paddingHorizontal: rs(20),
    borderWidth: 2,
    borderColor: "transparent",
    gap: rs(12),
    marginBottom: rs(16),
  },
  optionSelected: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "rgba(255,255,255,0.5)",
  },
  flag: {
    fontSize: rs(24),
  },
  optionLabel: {
    flex: 1,
    fontSize: rs(17),
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
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: "#ffffff",
    paddingVertical: rs(17),
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
    fontSize: rs(17),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
