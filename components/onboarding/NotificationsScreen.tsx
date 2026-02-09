import { useState, useEffect } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { requestPermissionAndSchedule } from '@/services/notifications';

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
  const startTime = '8:00 AM';
  const endTime = '9:00 PM';

  const handleEnableNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const granted = await requestPermissionAndSchedule(frequency);
      if (!granted) {
        Alert.alert(
          'Notifications disabled',
          'You can enable notifications later in your device Settings.',
          [{ text: 'OK', onPress: onNext }],
        );
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
      controlsOpacity.value = withDelay(300, withTiming(1, { duration: 700, easing: EASE_OUT }));
      controlsTranslateY.value = withDelay(300, withTiming(0, { duration: 700, easing: EASE_OUT }));
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
        <Text style={styles.heading}>
          {"Stay inspired daily"}
        </Text>
        <Text style={styles.subtitle}>
          {"Get gentle reminders with wisdom throughout your day"}
        </Text>

        <Animated.View style={[styles.notificationCard, cardStyle]}>
          <Text style={styles.notificationCardLabel}>Preview</Text>
          <View style={styles.notificationPreview}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>🐼</Text>
            </View>
            <View style={styles.notificationTextGroup}>
              <Text style={styles.notificationPreviewTitle}>Panda Quotes</Text>
              <Text style={styles.notificationPreviewBody}>
                {'"The journey of a thousand miles..."'}
              </Text>
            </View>
            <Text style={styles.notificationPreviewTime}>now</Text>
          </View>
        </Animated.View>

        <Animated.View style={controlsStyle}>
          <Text style={styles.frequencySectionLabel}>
            Daily quote frequency
          </Text>

          <View style={styles.frequencyRow}>
            <Pressable
              style={[
                styles.frequencyButton,
                frequency <= 1 && { opacity: 0.4 },
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
                frequency >= 5 && { opacity: 0.4 },
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
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleEnableNotifications}
          disabled={loading}
        >
          <Text style={[styles.nextButtonText, loading && styles.nextButtonTextDisabled]}>
            {loading ? 'Setting up...' : 'Enable notifications'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
