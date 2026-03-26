import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { QUOTES_BY_LANGUAGE } from "@/constants/quotes";

const WINDOW_START_HOUR = 8; // 8:00 AM
const WINDOW_END_HOUR = 21; // 9:00 PM
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60; // 780

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("daily-wisdom", {
    name: "Daily Wisdom",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    sound: null,
  });
}

function computeNotificationTimes(
  frequency: number,
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

async function scheduleNotifications(
  frequency: number,
  language: string,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const quotes = QUOTES_BY_LANGUAGE[language] ?? QUOTES_BY_LANGUAGE.en;
  const times = computeNotificationTimes(frequency);

  for (const { hour, minute } of times) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Panda Quotes 🐼",
        body: quote,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: Platform.OS === "android" ? "daily-wisdom" : undefined,
        hour,
        minute,
      },
    });
  }
}

// Returns true if permission was granted and notifications were scheduled.
// Caller is responsible for persisting the result to the settings store.
export async function requestPermissionAndSchedule(
  frequency: number,
  language: string,
): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  await scheduleNotifications(frequency, language);
  return true;
}

// Caller reads settings from the store and passes them in.
export async function rescheduleNotificationsIfNeeded(
  notificationEnabled: boolean,
  notificationFrequency: number,
  language: string,
): Promise<void> {
  if (Platform.OS === "web") return;
  await setupAndroidChannel();

  if (!notificationEnabled) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  await scheduleNotifications(notificationFrequency, language);
}
