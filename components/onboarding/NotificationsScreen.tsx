import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Image, Platform, Text, View, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { requestPermissionAndSchedule, openExactAlarmSettings, MIN_FREQUENCY, MAX_FREQUENCY } from '@/services/notifications';

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
  const [waitingForAlarmPermission, setWaitingForAlarmPermission] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const pendingFrequency = useRef(frequency);
  const startTime = '8:00 AM';
  const endTime = '9:00 PM';

  // When Android sends the user to Alarms & Reminders settings, listen for
  // the app returning to foreground and automatically retry scheduling.
  useEffect(() => {
    if (!waitingForAlarmPermission) return;
    const sub = AppState.addEventListener('change', async (state: AppStateStatus) => {
      if (state !== 'active') return;
      setLoading(true);
      try {
        const result = await requestPermissionAndSchedule(pendingFrequency.current);
        if (result === 'granted') {
          sub.remove();
          setPermissionGranted(true);
          setTimeout(() => onNext(), 800);
          return;
        }
        // User came back without granting — show a retry hint
        setRetryFailed(true);
      } catch {
        setRetryFailed(true);
      } finally {
        setLoading(false);
      }
    });
    return () => sub.remove();
  }, [waitingForAlarmPermission, onNext]);

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
      if (result === 'needs_exact_alarm') {
        // Open the system Alarms & Reminders settings directly — the AppState
        // listener above will complete the setup when the user comes back.
        pendingFrequency.current = frequency;
        setRetryFailed(false);
        setWaitingForAlarmPermission(true);
        openExactAlarmSettings();
        return;
      }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      cardTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
      controlsOpacity.value = withDelay(
        300,
        withTiming(1, { duration: 700, easing: EASE_OUT })
      );
      controlsTranslateY.value = withDelay(
        300,
        withTiming(0, { duration: 700, easing: EASE_OUT })
      );
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

        <Animated.View style={[styles.notificationCard, cardStyle]}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('@/docs/notification-preview.png')}
            style={{ width: '100%', aspectRatio: 1400 / 800, borderRadius: 8 }}
            resizeMode="contain"
          />
        </Animated.View>

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
        {waitingForAlarmPermission && Platform.OS === 'android' && (
          <Text style={[styles.summaryText, { marginBottom: 12 }]}>
            {retryFailed
              ? 'It looks like the permission wasn\'t enabled. Open Settings and toggle "Alarms & Reminders" for this app.'
              : 'Enable "Alarms & Reminders" for this app, then come back here.'}
          </Text>
        )}
        <Pressable
          style={[styles.nextButton, (loading || permissionGranted) && styles.nextButtonDisabled]}
          onPress={waitingForAlarmPermission ? openExactAlarmSettings : handleEnableNotifications}
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
              ? (waitingForAlarmPermission ? 'Checking...' : 'Setting up...')
              : waitingForAlarmPermission
              ? (retryFailed ? 'Try again in Settings' : 'Open Settings')
              : 'Enable notifications'}
          </Text>
        </Pressable>
        <Pressable style={styles.skipLink} onPress={onNext} disabled={loading || permissionGranted}>
          <Text style={styles.skipLinkText}>
            {waitingForAlarmPermission ? 'Continue without' : 'Maybe later'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
