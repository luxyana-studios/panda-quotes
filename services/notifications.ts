import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY_FREQUENCY = 'notification_frequency';
const STORAGE_KEY_GRANTED = 'notification_granted';
const CHANNEL_ID = 'panda-quotes-v2';

export type NotificationSetupResult = 'granted' | 'denied';

const WINDOW_START_HOUR = 8; // 8:00 AM
const WINDOW_END_HOUR = 21; // 9:00 PM
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60;
export const MIN_FREQUENCY = 1;
export const MAX_FREQUENCY = 5;

const NOTIFICATION_TEASERS = [
  "I've been sitting with a thought for you 🐼",
  "I have something to share with you today 🐼",
  "I've been waiting to offer you a moment of calm 🐼",
  "I have your daily dose of wisdom ready 🐼",
  "I've found a thought worth sitting with 🐼",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily Quotes',
    description: 'Gentle daily reminders with panda wisdom',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#d4a574',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
    showBadge: false,
  });
}

function computeNotificationTimes(
  frequency: number
): { hour: number; minute: number }[] {
  const interval = WINDOW_MINUTES / (frequency + 1);
  return Array.from({ length: frequency }, (_, i) => {
    const totalMinutes = WINDOW_START_HOUR * 60 + Math.round(interval * (i + 1));
    return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
  });
}

async function scheduleNotifications(rawFrequency: number): Promise<void> {
  const frequency = Math.min(Math.max(rawFrequency, MIN_FREQUENCY), MAX_FREQUENCY);
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Try CALENDAR triggers (exact daily times within the window).
  // On Android 13+, USE_EXACT_ALARM is auto-granted so this works without user interaction.
  // On Android 12 without SCHEDULE_EXACT_ALARM, this throws — we catch and fall back.
  // On iOS, CALENDAR triggers always work.
  try {
    await Promise.all(
      computeNotificationTimes(frequency).map(({ hour, minute }, index) =>
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Panda Quotes',
            body: NOTIFICATION_TEASERS[index % NOTIFICATION_TEASERS.length],
            ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
          },
        })
      )
    );
  } catch (e) {
    if (Platform.OS !== 'android') throw e;
    // Fallback for Android 12 without exact alarm permission: TIME_INTERVAL repeating.
    // These fire every N seconds from now — approximate, but guaranteed to work.
    await Notifications.cancelAllScheduledNotificationsAsync();
    const intervalSeconds = Math.round(86400 / frequency);
    await Promise.all(
      Array.from({ length: frequency }, (_, i) =>
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Panda Quotes',
            body: NOTIFICATION_TEASERS[i % NOTIFICATION_TEASERS.length],
            ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: intervalSeconds,
            repeats: true,
          },
        })
      )
    );
  }
}

export async function requestPermissionAndSchedule(
  frequency: number
): Promise<NotificationSetupResult> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return 'denied';

  await AsyncStorage.setItem(STORAGE_KEY_FREQUENCY, String(frequency));
  await AsyncStorage.setItem(STORAGE_KEY_GRANTED, 'true');
  await scheduleNotifications(frequency);

  return 'granted';
}

export async function getNotificationSettings(): Promise<{ enabled: boolean; frequency: number }> {
  const [granted, stored, { status }] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEY_GRANTED),
    AsyncStorage.getItem(STORAGE_KEY_FREQUENCY),
    Notifications.getPermissionsAsync(),
  ]);
  return {
    enabled: granted === 'true' && status === 'granted',
    frequency: stored ? parseInt(stored, 10) : 3,
  };
}

export async function disableNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.setItem(STORAGE_KEY_GRANTED, 'false');
}

export async function rescheduleNotificationsIfNeeded(): Promise<void> {
  const granted = await AsyncStorage.getItem(STORAGE_KEY_GRANTED);
  if (granted !== 'true') return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  // On Android, TIME_INTERVAL triggers persist until explicitly cancelled.
  // Don't reschedule on every app open — that resets the timer from now.
  // Only reschedule if no notifications are scheduled (e.g. after reinstall).
  if (Platform.OS === 'android') {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    if (scheduled.length > 0) return;
  }

  const stored = await AsyncStorage.getItem(STORAGE_KEY_FREQUENCY);
  const frequency = stored ? parseInt(stored, 10) : 3;
  await scheduleNotifications(frequency);
}
