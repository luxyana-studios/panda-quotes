import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RED_PANDA_QUOTES } from '@/constants/quotes';

const STORAGE_KEY_FREQUENCY = 'notification_frequency';
const STORAGE_KEY_GRANTED = 'notification_granted';

const WINDOW_START_HOUR = 8; // 8:00 AM
const WINDOW_END_HOUR = 21; // 9:00 PM
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60; // 780

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function getRandomQuote(): string {
  return RED_PANDA_QUOTES[Math.floor(Math.random() * RED_PANDA_QUOTES.length)];
}

function computeNotificationTimes(frequency: number): { hour: number; minute: number }[] {
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
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = computeNotificationTimes(frequency);

  for (const { hour, minute } of times) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Panda Quotes 🐼',
        body: getRandomQuote(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
}

export async function requestPermissionAndSchedule(frequency: number): Promise<boolean> {
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

  const stored = await AsyncStorage.getItem(STORAGE_KEY_FREQUENCY);
  const frequency = stored ? parseInt(stored, 10) : 3;

  await scheduleNotifications(frequency);
}
