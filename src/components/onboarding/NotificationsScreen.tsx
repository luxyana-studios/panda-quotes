import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/features/settings/stores/settings.store";
import { requestPermissionAndSchedule } from "@/services/notifications";
import { onboardingStyles as styles } from "@/styles/onboarding.styles";

interface NotificationsScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function NotificationsScreen({
  onNext,
  onBack,
  onSkip,
}: NotificationsScreenProps) {
  const { t } = useTranslation();
  const [frequency, setFrequency] = useState(3);
  const [loading, setLoading] = useState(false);

  const { setNotificationPrefs, language } = useSettingsStore();

  const startTime = t("onboarding.notifications.startTime");
  const endTime = t("onboarding.notifications.endTime");

  const handleEnableNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const granted = await requestPermissionAndSchedule(frequency, language);
      if (!granted) {
        Alert.alert(
          t("onboarding.notifications.alertTitle"),
          t("onboarding.notifications.alertMessage"),
          [{ text: t("onboarding.notifications.alertOk"), onPress: onNext }],
        );
        return;
      }
      setNotificationPrefs(true, frequency);
      onNext();
    } catch {
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const controlsOpacity = useSharedValue(0);
  const controlsTranslateY = useSharedValue(16);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsTranslateY.value }],
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reanimated shared values are stable refs
  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      cardTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
      controlsOpacity.value = withDelay(
        300,
        withTiming(1, { duration: 700, easing: EASE_OUT }),
      );
      controlsTranslateY.value = withDelay(
        300,
        withTiming(0, { duration: 700, easing: EASE_OUT }),
      );
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const frequencyScale = useSharedValue(1);
  const frequencyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: frequencyScale.value }],
  }));

  const decrementFrequency = () => {
    if (frequency > 1) {
      frequencyScale.value = withSpring(0.85, { damping: 10 }, () => {
        frequencyScale.value = withSpring(1, { damping: 10 });
      });
      setFrequency((prev) => prev - 1);
    }
  };

  const incrementFrequency = () => {
    if (frequency < 5) {
      frequencyScale.value = withSpring(1.15, { damping: 10 }, () => {
        frequencyScale.value = withSpring(1, { damping: 10 });
      });
      setFrequency((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>{"\u2039"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {t("onboarding.notifications.header")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDotActive} />
      </View>

      <View style={styles.screenContent}>
        <Text style={styles.heading}>
          {t("onboarding.notifications.heading")}
        </Text>
        <Text style={styles.subtitle}>
          {t("onboarding.notifications.subtitle")}
        </Text>

        <Animated.View style={[styles.notificationCard, cardStyle]}>
          <Text style={styles.notificationCardLabel}>
            {t("onboarding.notifications.preview")}
          </Text>
          <View style={styles.notificationPreview}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>🐼</Text>
            </View>
            <View style={styles.notificationTextGroup}>
              <Text style={styles.notificationPreviewTitle}>
                {t("onboarding.notifications.previewTitle")}
              </Text>
              <Text style={styles.notificationPreviewBody}>
                {t("onboarding.notifications.previewBody")}
              </Text>
            </View>
            <Text style={styles.notificationPreviewTime}>
              {t("onboarding.notifications.previewTime")}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={controlsStyle}>
          <Text style={styles.frequencySectionLabel}>
            {t("onboarding.notifications.frequencyLabel")}
          </Text>

          <View style={styles.frequencyRow}>
            <Pressable
              style={[
                styles.frequencyButton,
                frequency <= 1 && { opacity: 0.4 },
              ]}
              onPress={decrementFrequency}
            >
              <Text style={styles.frequencyButtonText}>{"\u2212"}</Text>
            </Pressable>
            <Animated.View style={frequencyStyle}>
              <Text style={styles.frequencyValue}>
                {frequency}
                <Text style={styles.frequencyUnit}>x</Text>
              </Text>
            </Animated.View>
            <Pressable
              style={[
                styles.frequencyButton,
                frequency >= 5 && { opacity: 0.4 },
              ]}
              onPress={incrementFrequency}
            >
              <Text style={styles.frequencyButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>
                {t("onboarding.notifications.timeStart")}
              </Text>
              <Text style={styles.timeValue}>{startTime}</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>
                {t("onboarding.notifications.timeEnd")}
              </Text>
              <Text style={styles.timeValue}>{endTime}</Text>
            </View>
          </View>

          <Text style={styles.summaryText}>
            {t("onboarding.notifications.summary", {
              count: frequency,
              start: startTime,
              end: endTime,
            })}
          </Text>

          <Pressable style={skipButtonStyle} onPress={onSkip}>
            <Text style={skipButtonTextStyle}>
              {t("onboarding.notifications.later")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleEnableNotifications}
          disabled={loading}
        >
          <Text
            style={[
              styles.nextButtonText,
              loading && styles.nextButtonTextDisabled,
            ]}
          >
            {loading
              ? t("onboarding.notifications.settingUp")
              : t("onboarding.notifications.enable")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const skipButtonStyle: import("react-native").ViewStyle = {
  alignSelf: "center",
  marginTop: 20,
  paddingVertical: 8,
  paddingHorizontal: 16,
};

const skipButtonTextStyle: import("react-native").TextStyle = {
  fontSize: 14,
  color: colors.brandPrimary,
  fontWeight: "500",
  textDecorationLine: "underline",
  opacity: 0.75,
};
