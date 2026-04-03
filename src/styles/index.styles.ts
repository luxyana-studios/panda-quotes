import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { rs } from "@/core/theme/responsive";

export const styles = StyleSheet.create({
  // ─── Container ────────────────────────────────────────────
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.brandAccent,
    padding: rs(24),
    gap: rs(20),
  },
  topDecoration: {
    position: "absolute",
    top: -80,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: -100,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  // ─── Panda Image ──────────────────────────────────────────
  pandaImageWrapper: {
    width: rs(140),
    height: rs(140),
    borderRadius: rs(70),
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  pandaImage: {
    width: "100%",
    height: "100%",
  },

  // ─── Quote Card ───────────────────────────────────────────
  quoteContainer: {
    backgroundColor: colors.brandLight,
    borderRadius: rs(24),
    padding: rs(28),
    marginVertical: rs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: rs(360),
    width: "100%",
  },
  quoteText: {
    fontSize: rs(22),
    lineHeight: rs(34),
    color: colors.brandDark,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: rs(16),
    letterSpacing: 0.2,
  },
  author: {
    fontSize: rs(14),
    color: colors.brandPrimary,
    textAlign: "right",
    fontWeight: "500",
  },

  // ─── Intention Text ───────────────────────────────────────
  intentionContainer: {
    paddingHorizontal: rs(32),
    gap: rs(14),
  },
  intentionText: {
    fontSize: rs(21),
    lineHeight: rs(32),
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  // ─── Buttons ──────────────────────────────────────────────
  buttonContainer: {
    gap: rs(14),
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: rs(17),
    paddingHorizontal: rs(36),
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    minWidth: rs(220),
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.brandDark,
    fontSize: rs(17),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: rs(12),
    paddingHorizontal: rs(24),
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: rs(15),
    fontWeight: "500",
    textAlign: "center",
  },

  // ─── Completion / Closing ─────────────────────────────────
  completionContainer: {
    gap: rs(20),
    alignItems: "center",
  },
  closingMessage: {
    fontSize: rs(17),
    color: "rgba(255,255,255,0.85)",
    fontStyle: "italic",
    textAlign: "center",
  },
});
