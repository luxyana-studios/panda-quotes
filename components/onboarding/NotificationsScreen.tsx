import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface NotificationsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function NotificationsScreen({
  onNext,
  onBack,
}: NotificationsScreenProps) {
  const [frequency, setFrequency] = useState(3);
  const startTime = '8:00 AM';
  const endTime = '9:00 PM';

  const decrementFrequency = () => {
    setFrequency((prev) => Math.max(1, prev - 1));
  };

  const incrementFrequency = () => {
    setFrequency((prev) => Math.min(5, prev + 1));
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

      <View style={styles.screenContent}>
        <Text style={styles.heading}>Get wisdom throughout the day</Text>
        <Text style={styles.subtitle}>
          {"We'll send you gentle reminders with quotes"}
        </Text>

        <View style={styles.notificationCard}>
          <View style={styles.notificationPreview}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>🐼</Text>
            </View>
            <View>
              <Text style={styles.notificationPreviewTitle}>Panda Quotes</Text>
              <Text style={styles.notificationPreviewBody}>
                {'"The journey of a thousand miles..."'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.frequencyRow}>
          <Pressable style={styles.frequencyButton} onPress={decrementFrequency}>
            <Text style={styles.frequencyButtonText}>{'\u2212'}</Text>
          </Pressable>
          <Text style={styles.frequencyValue}>{frequency}x</Text>
          <Pressable style={styles.frequencyButton} onPress={incrementFrequency}>
            <Text style={styles.frequencyButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Start time</Text>
            <Text style={styles.timeValue}>{startTime}</Text>
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>End time</Text>
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
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
