import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY_FREQUENCY = 'notification_frequency';
const STORAGE_KEY_GRANTED = 'notification_granted';
const CHANNEL_ID = 'panda-quotes';

const WINDOW_START_HOUR = 8; // 8:00 AM
const WINDOW_END_HOUR = 21; // 9:00 PM
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60;

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
    importance: Notifications.AndroidImportance.DEFAULT,
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

async function scheduleNotifications(frequency: number): Promise<void> {
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

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

  if (finalStatus !== 'granted') return false;

  await scheduleNotifications(frequency);
  await AsyncStorage.setItem(STORAGE_KEY_FREQUENCY, String(frequency));
  await AsyncStorage.setItem(STORAGE_KEY_GRANTED, 'true');

  return true;
}

// Repeating triggers run indefinitely — rescheduling is only needed
// if the user changes their frequency setting.
export async function rescheduleNotificationsIfNeeded(): Promise<void> {
  const granted = await AsyncStorage.getItem(STORAGE_KEY_GRANTED);
  if (granted !== 'true') return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  const stored = await AsyncStorage.getItem(STORAGE_KEY_FREQUENCY);
  const frequency = stored ? parseInt(stored, 10) : 3;
  await scheduleNotifications(frequency);
}
