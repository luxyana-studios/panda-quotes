import { useState, useEffect } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { requestPermissionAndSchedule, MIN_FREQUENCY, MAX_FREQUENCY } from '@/services/notifications';

interface NotificationsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function NotificationsScreen({
  onNext,
  onBack,
}: NotificationsScreenProps) {
  const [frequency, setFrequency] = useState(3);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const startTime = '8:00 AM';
  const endTime = '9:00 PM';

  const handleEnableNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await requestPermissionAndSchedule(frequency);
      if (result === 'denied') {
        Alert.alert(
          'Notifications disabled',
          'You can enable notifications later in your device Settings.',
          [{ text: 'OK', onPress: onNext }]
        );
        return;
      }
      setPermissionGranted(true);
      setTimeout(() => onNext(), 800);
    } catch {
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const controlsOpacity = useSharedValue(0);
  const controlsTranslateY = useSharedValue(16);

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsTranslateY.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      controlsOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      controlsTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const frequencyScale = useSharedValue(1);
  const frequencyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: frequencyScale.value }],
  }));

  const decrementFrequency = () => {
    if (frequency > MIN_FREQUENCY) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      frequencyScale.value = withSpring(0.85, { damping: 10 }, () => {
        frequencyScale.value = withSpring(1, { damping: 10 });
      });
      setFrequency((prev) => prev - 1);
    }
  };

  const incrementFrequency = () => {
    if (frequency < MAX_FREQUENCY) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          <Text style={styles.headerBackText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDotActive} />
      </View>

      <View style={styles.screenContent}>
        <Text style={styles.heading}>{'Stay inspired daily'}</Text>
        <Text style={styles.subtitle}>
          {'Get gentle reminders with wisdom throughout your day'}
        </Text>

        <Animated.View style={controlsStyle}>
          <Text style={styles.frequencySectionLabel}>
            Daily quote frequency
          </Text>

          <View style={styles.frequencyRow}>
            <Pressable
              style={[
                styles.frequencyButton,
                frequency <= MIN_FREQUENCY && { opacity: 0.4 },
              ]}
              onPress={decrementFrequency}
            >
              <Text style={styles.frequencyButtonText}>{'\u2212'}</Text>
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
                frequency >= MAX_FREQUENCY && { opacity: 0.4 },
              ]}
              onPress={incrementFrequency}
            >
              <Text style={styles.frequencyButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Start</Text>
              <Text style={styles.timeValue}>{startTime}</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>End</Text>
              <Text style={styles.timeValue}>{endTime}</Text>
            </View>
          </View>

          <Text style={styles.summaryText}>
            {"You'll receive "}
            {frequency} {frequency === 1 ? 'quote' : 'quotes'}
            {' per day between '}
            {startTime}
            {' and '}
            {endTime}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[styles.nextButton, (loading || permissionGranted) && styles.nextButtonDisabled]}
          onPress={handleEnableNotifications}
          disabled={loading || permissionGranted}
        >
          <Text
            style={[
              styles.nextButtonText,
              (loading || permissionGranted) && styles.nextButtonTextDisabled,
            ]}
          >
            {permissionGranted
              ? '✓ All set!'
              : loading
              ? 'Setting up...'
              : 'Enable notifications'}
          </Text>
        </Pressable>
        <Pressable style={styles.skipLink} onPress={onNext} disabled={loading || permissionGranted}>
          <Text style={styles.skipLinkText}>Maybe later</Text>
        </Pressable>
      </View>
    </View>
  );
}
