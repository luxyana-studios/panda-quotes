import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export const onboardingStyles = StyleSheet.create({
  // Welcome Screen (Screen 1)
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandAccent,
    padding: 20,
    gap: 16,
  },
  welcomePandaImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.brandLight,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.brandLight,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: colors.brandLight,
    textAlign: 'center',
    opacity: 0.9,
  },
  welcomeDescription: {
    fontSize: 15,
    color: colors.brandLight,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  getStartedButton: {
    backgroundColor: colors.brandLight,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: colors.brandAccent,
    fontSize: 18,
    fontWeight: '600',
  },

  // Shared layout for screens 2-5
  screenContainer: {
    flex: 1,
    backgroundColor: colors.brandLight,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackText: {
    fontSize: 28,
    color: colors.brandDark,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.brandPrimary,
  },
  headerSkipButton: {
    padding: 8,
  },
  headerSkipText: {
    fontSize: 16,
    color: colors.brandPrimary,
  },
  headerSpacer: {
    width: 44,
  },

  // Modi image (smaller, for screens 2-4)
  smallPandaImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.earthSand,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  // Headings & subtitles
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.brandDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.brandPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Name screen input
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.earthSand,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    color: colors.brandDark,
    marginHorizontal: 8,
  },

  // Categories chip grid
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.brandMuted,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: colors.brandSecondary,
  },
  chipText: {
    fontSize: 15,
    color: colors.brandDark,
  },
  chipCheckmark: {
    fontSize: 14,
    color: colors.brandDark,
  },

  // Notifications screen
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.earthSand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.brandAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconText: {
    fontSize: 18,
  },
  notificationPreviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.brandDark,
  },
  notificationPreviewBody: {
    fontSize: 13,
    color: colors.brandPrimary,
    marginTop: 2,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  frequencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.earthSand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 22,
    color: colors.brandDark,
    fontWeight: '500',
  },
  frequencyValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.brandDark,
    minWidth: 50,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 13,
    color: colors.brandPrimary,
    marginBottom: 6,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.brandDark,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.earthSand,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  summaryText: {
    fontSize: 14,
    color: colors.brandPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Bottom button (shared for screens 2-5)
  bottomButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  nextButton: {
    backgroundColor: colors.brandDark,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: colors.brandLight,
    fontSize: 17,
    fontWeight: '600',
  },

  // Welcome back screen (Screen 5)
  welcomeBackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandLight,
    padding: 20,
  },
  welcomeBackTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.brandDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeBackSubtitle: {
    fontSize: 18,
    color: colors.brandPrimary,
    textAlign: 'center',
  },
});
