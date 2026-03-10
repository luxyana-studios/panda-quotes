import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { RED_PANDA_QUOTES } from '@/constants/quotes';

const STORAGE_KEY_FREQUENCY = 'notification_frequency';
const STORAGE_KEY_GRANTED = 'notification_granted';
const STORAGE_KEY_LAST_SCHEDULED = 'notification_last_scheduled';
const CHANNEL_ID = 'panda-quotes-daily';

const WINDOW_START_HOUR = 8; // 8:00 AM
const WINDOW_END_HOUR = 21; // 9:00 PM
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60; // 780
const DAYS_AHEAD = 12; // iOS cap is 64; 12 days × 5 max freq = 60 notifications

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily Quotes',
    description: 'Gentle daily reminders with panda wisdom',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#d4a574',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
    showBadge: false,
  });
}

function getShuffledQuotes(count: number): string[] {
  const pool = [...RED_PANDA_QUOTES].sort(() => Math.random() - 0.5);
  const result: string[] = [];
  while (result.length < count) {
    result.push(...pool.slice(0, Math.min(pool.length, count - result.length)));
  }
  return result;
}

function computeNotificationTimes(
  frequency: number
): { hour: number; minute: number }[] {
  const times: { hour: number; minute: number }[] = [];
  const interval = WINDOW_MINUTES / (frequency + 1);

  for (let i = 1; i <= frequency; i++) {
    const minutesFromStart = Math.round(interval * i);
    const totalMinutes = WINDOW_START_HOUR * 60 + minutesFromStart;
    times.push({
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    });
  }

  return times;
}

async function scheduleNotifications(frequency: number): Promise<void> {
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = computeNotificationTimes(frequency);
  const now = new Date();
  const quotes = getShuffledQuotes(DAYS_AHEAD * frequency);
  let quoteIndex = 0;

  const schedulePromises: Promise<string>[] = [];

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
    for (const { hour, minute } of times) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + dayOffset,
        hour,
        minute,
        0
      );

      // Skip times already passed today
      if (date <= now) continue;

      schedulePromises.push(
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Panda Quotes 🐼',
            body: quotes[quoteIndex++ % quotes.length],
            ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
          },
        })
      );
    }
  }

  await Promise.all(schedulePromises);

  await AsyncStorage.setItem(STORAGE_KEY_LAST_SCHEDULED, String(Date.now()));
}

export async function requestPermissionAndSchedule(
  frequency: number
): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  await scheduleNotifications(frequency);
  await AsyncStorage.setItem(STORAGE_KEY_FREQUENCY, String(frequency));
  await AsyncStorage.setItem(STORAGE_KEY_GRANTED, 'true');

  return true;
}

export async function rescheduleNotificationsIfNeeded(): Promise<void> {
  const granted = await AsyncStorage.getItem(STORAGE_KEY_GRANTED);
  if (granted !== 'true') return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  // Only reschedule when coverage drops below ~2 days remaining
  const lastScheduled = await AsyncStorage.getItem(STORAGE_KEY_LAST_SCHEDULED);
  if (lastScheduled) {
    const daysSince =
      (Date.now() - parseInt(lastScheduled, 10)) / (1000 * 60 * 60 * 24);
    if (daysSince < 2) return;
  }

  const stored = await AsyncStorage.getItem(STORAGE_KEY_FREQUENCY);
  const frequency = stored ? parseInt(stored, 10) : 3;

  await scheduleNotifications(frequency);
}
