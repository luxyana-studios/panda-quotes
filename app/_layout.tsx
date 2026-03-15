import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { rescheduleNotificationsIfNeeded } from '@/services/notifications';

export default function RootLayout() {
  useEffect(() => {
    rescheduleNotificationsIfNeeded();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
