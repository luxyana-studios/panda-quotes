import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/features/settings/stores/settings.store";
import {
  requestPermissionAndSchedule,
  rescheduleNotificationsIfNeeded,
} from "@/services/notifications";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
] as const;

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const {
    language,
    notificationEnabled,
    notificationFrequency,
    setLanguage,
    setNotificationPrefs,
  } = useSettingsStore();

  const [selectedLanguage, setSelectedLanguage] = useState(language ?? "en");
  const [notifEnabled, setNotifEnabled] = useState(notificationEnabled);
  const [frequency, setFrequency] = useState(notificationFrequency);
  const [saving, setSaving] = useState(false);

  // Sync local state from store every time the modal opens
  useEffect(() => {
    if (visible) {
      setSelectedLanguage(language ?? "en");
      setNotifEnabled(notificationEnabled);
      setFrequency(notificationFrequency);
    }
  }, [visible, language, notificationEnabled, notificationFrequency]);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setLanguage(code);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (notifEnabled) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const granted = await requestPermissionAndSchedule(
            frequency,
            selectedLanguage,
          );
          if (!granted) {
            Alert.alert(
              t("onboarding.notifications.alertTitle"),
              t("onboarding.notifications.alertMessage"),
              [{ text: t("onboarding.notifications.alertOk") }],
            );
            setNotifEnabled(false);
            setNotificationPrefs(false, frequency);
            onClose();
            return;
          }
        } else {
          await rescheduleNotificationsIfNeeded(
            true,
            frequency,
            selectedLanguage,
          );
        }
        setNotificationPrefs(true, frequency);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setNotificationPrefs(false, frequency);
      }
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("settings.title")}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Language section */}
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
          <View style={styles.languageList}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageLabel,
                      isSelected && styles.languageLabelSelected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}
          </View>

          {/* Notifications section */}
          <Text style={styles.sectionTitle}>{t("settings.notifications")}</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>
                {t("settings.notificationsToggle")}
              </Text>
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{
                  false: colors.earthSand,
                  true: colors.brandAccent,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.frequencyRow}>
              <Pressable
                style={[styles.freqButton, frequency <= 1 && { opacity: 0.4 }]}
                onPress={() => setFrequency((f) => Math.max(1, f - 1))}
              >
                <Text style={styles.freqButtonText}>−</Text>
              </Pressable>
              <Text style={styles.freqValue}>
                {frequency}
                <Text style={styles.freqUnit}>×</Text>
              </Text>
              <Pressable
                style={[styles.freqButton, frequency >= 5 && { opacity: 0.4 }]}
                onPress={() => setFrequency((f) => Math.min(5, f + 1))}
              >
                <Text style={styles.freqButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>{t("settings.save")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.brandLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.earthSand,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.brandDark,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.earthSand,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    color: colors.brandDark,
    fontWeight: "600",
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.brandPrimary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 10,
  },
  languageList: {
    gap: 8,
    marginBottom: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: colors.earthSand,
    gap: 12,
  },
  languageOptionSelected: {
    borderColor: colors.brandAccent,
    backgroundColor: "rgba(212,165,116,0.08)",
  },
  flag: {
    fontSize: 22,
  },
  languageLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.brandDark,
  },
  languageLabelSelected: {
    fontWeight: "700",
    color: colors.brandDark,
  },
  checkmark: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.brandAccent,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.earthSand,
    overflow: "hidden",
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.brandDark,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: colors.earthSand,
  },
  freqButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandLight,
    borderWidth: 1.5,
    borderColor: colors.earthSand,
    justifyContent: "center",
    alignItems: "center",
  },
  freqButtonText: {
    fontSize: 20,
    color: colors.brandDark,
    fontWeight: "500",
  },
  freqValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.brandDark,
    minWidth: 50,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  freqUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.brandPrimary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 44,
    borderTopWidth: 1,
    borderTopColor: colors.earthSand,
  },
  saveButton: {
    backgroundColor: colors.brandDark,
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: colors.brandDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
