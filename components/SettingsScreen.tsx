import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform, Text, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import {
  requestPermissionAndSchedule,
  disableNotifications,
  openExactAlarmSettings,
  getNotificationSettings,
  MIN_FREQUENCY,
  MAX_FREQUENCY,
} from '@/services/notifications';

interface SettingsScreenProps {
  onBack: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [frequency, setFrequency] = useState(3);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [waitingForAlarmPermission, setWaitingForAlarmPermission] = useState(false);
  const pendingFrequency = useRef(frequency);

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  useEffect(() => {
    getNotificationSettings().then(({ enabled: e, frequency: f }) => {
      setEnabled(e);
      setFrequency(f);
    });
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      cardTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry scheduling automatically when the user returns from Alarms & Reminders settings.
  useEffect(() => {
    if (!waitingForAlarmPermission) return;
    const sub = AppState.addEventListener('change', async (state: AppStateStatus) => {
      if (state !== 'active') return;
      setLoading(true);
      try {
        const result = await requestPermissionAndSchedule(pendingFrequency.current);
        if (result === 'granted') {
          sub.remove();
          setWaitingForAlarmPermission(false);
          setEnabled(true);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        // stay in waiting state
      } finally {
        setLoading(false);
      }
    });
    return () => sub.remove();
  }, [waitingForAlarmPermission]);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    setSaved(false);
    try {
      const result = await requestPermissionAndSchedule(frequency);
      if (result === 'denied') {
        setEnabled(false);
      } else if (result === 'needs_exact_alarm') {
        pendingFrequency.current = frequency;
        setWaitingForAlarmPermission(true);
        openExactAlarmSettings();
      } else {
        setEnabled(true);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await disableNotifications();
      setEnabled(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.brandAccent, padding: 24 }}>
      {/* Decorative circles */}
      <View style={{ position: 'absolute', top: -80, right: -50, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.08)' }} />
      <View style={{ position: 'absolute', bottom: -100, left: -70, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.06)' }} />

      {/* Back button */}
      <Pressable
        onPress={onBack}
        style={{ position: 'absolute', top: 52, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
      >
        <Text style={{ fontSize: 26, color: '#fff', lineHeight: 30, marginLeft: -2 }}>{'‹'}</Text>
      </Pressable>

      {/* Title */}
      <View style={{ paddingTop: 52, alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>Settings</Text>
      </View>

      {/* Notification card */}
      <Animated.View style={[{
        backgroundColor: colors.brandLight,
        borderRadius: 24,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
      }, cardStyle]}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brandDark, marginBottom: 20, letterSpacing: 0.2 }}>
          Daily Notifications
        </Text>

        <Text style={{ fontSize: 11, color: colors.brandPrimary, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          Quotes per day
        </Text>

        {/* Frequency picker */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 24 }}>
          <Pressable
            onPress={() => {
              if (frequency > MIN_FREQUENCY) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFrequency(f => f - 1);
              }
            }}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.earthSand, justifyContent: 'center', alignItems: 'center', opacity: frequency <= MIN_FREQUENCY ? 0.4 : 1 }}
          >
            <Text style={{ fontSize: 22, color: colors.brandDark, lineHeight: 26 }}>{'\u2212'}</Text>
          </Pressable>

          <Text style={{ fontSize: 44, fontWeight: '700', color: colors.brandDark, minWidth: 64, textAlign: 'center', lineHeight: 52 }}>
            {frequency}
            <Text style={{ fontSize: 20, color: colors.brandPrimary, fontWeight: '500' }}>x</Text>
          </Text>

          <Pressable
            onPress={() => {
              if (frequency < MAX_FREQUENCY) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFrequency(f => f + 1);
              }
            }}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.earthSand, justifyContent: 'center', alignItems: 'center', opacity: frequency >= MAX_FREQUENCY ? 0.4 : 1 }}
          >
            <Text style={{ fontSize: 22, color: colors.brandDark, lineHeight: 26 }}>+</Text>
          </Pressable>
        </View>

        {/* Time window */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', borderTopWidth: 1, borderTopColor: colors.earthSand, paddingTop: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.brandPrimary, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>Start</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brandDark, marginTop: 4 }}>8:00 AM</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.earthSand }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.brandPrimary, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>End</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brandDark, marginTop: 4 }}>9:00 PM</Text>
          </View>
        </View>
      </Animated.View>

      {/* Waiting for alarm permission */}
      {waitingForAlarmPermission && Platform.OS === 'android' && (
        <Text style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontSize: 14, lineHeight: 21, marginTop: 20 }}>
          {'Enable "Alarms & Reminders" for this app, then come back here.'}
        </Text>
      )}

      <View style={{ flex: 1 }} />

      {/* Bottom actions */}
      <View style={{ gap: 4, paddingBottom: 32 }}>
        {saved && (
          <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: 15, fontWeight: '600', marginBottom: 8 }}>
            {'\u2713'} Saved
          </Text>
        )}
        <Pressable
          onPress={waitingForAlarmPermission ? openExactAlarmSettings : handleSave}
          disabled={loading}
          style={{
            backgroundColor: '#fff',
            paddingVertical: 17,
            borderRadius: 30,
            alignItems: 'center',
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 4,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ color: colors.brandDark, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
            {loading
              ? 'Saving...'
              : waitingForAlarmPermission
              ? 'Open Settings'
              : 'Save changes'}
          </Text>
        </Pressable>

        {enabled && !waitingForAlarmPermission && (
          <Pressable onPress={handleDisable} disabled={loading} style={{ paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
              Turn off notifications
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
