import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SettingsModal } from "@/components/SettingsModal";
import { styles } from "@/styles/index.styles";

const pandaVideo = require("@/assets/panda-animate.mp4");

interface StartScreenProps {
  onReady: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASE_SPRING = Easing.bezier(0.34, 1.56, 0.64, 1);

export function StartScreen({ onReady }: StartScreenProps) {
  const { t } = useTranslation();
  const [showButton, setShowButton] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isAnimatingRef = useRef(false);

  const imageOpacity = useSharedValue(0);
  const imageTranslateY = useSharedValue(20);
  const text1Opacity = useSharedValue(0);
  const text1TranslateY = useSharedValue(16);
  const text2Opacity = useSharedValue(0);
  const text2TranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);
  const circleScale = useSharedValue(1);
  const circleGlow = useSharedValue(0);
  const staticImageOpacity = useSharedValue(1);
  const videoOpacity = useSharedValue(0);

  const player = useVideoPlayer(pandaVideo, (p) => {
    p.loop = false;
  });

  // ── Animated styles ──────────────────────────────────────────

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ translateY: imageTranslateY.value }],
  }));

  const text1Style = useAnimatedStyle(() => ({
    opacity: text1Opacity.value,
    transform: [{ translateY: text1TranslateY.value }],
  }));

  const text2Style = useAnimatedStyle(() => ({
    opacity: text2Opacity.value,
    transform: [{ translateY: text2TranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const circleWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    shadowOpacity: 0.2 + circleGlow.value * 0.4,
    shadowRadius: 16 + circleGlow.value * 24,
  }));

  const staticImageStyle = useAnimatedStyle(() => ({
    opacity: staticImageOpacity.value,
  }));

  const videoStyle = useAnimatedStyle(() => ({
    opacity: videoOpacity.value,
  }));

  // ── Screen entrance animation ────────────────────────────────

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reanimated shared values are stable refs
  useEffect(() => {
    const timer = setTimeout(() => {
      imageOpacity.value = withTiming(1, { duration: 900, easing: EASE_OUT });
      imageTranslateY.value = withTiming(0, {
        duration: 900,
        easing: EASE_OUT,
      });

      text1Opacity.value = withDelay(
        400,
        withTiming(1, { duration: 900, easing: EASE_OUT }),
      );
      text1TranslateY.value = withDelay(
        400,
        withTiming(0, { duration: 900, easing: EASE_OUT }),
      );

      text2Opacity.value = withDelay(
        1200,
        withTiming(1, { duration: 900, easing: EASE_OUT }),
      );
      text2TranslateY.value = withDelay(
        1200,
        withTiming(0, { duration: 900, easing: EASE_OUT }),
      );

      setTimeout(() => {
        setShowButton(true);
        buttonOpacity.value = withTiming(1, {
          duration: 700,
          easing: EASE_OUT,
        });
        buttonTranslateY.value = withTiming(0, {
          duration: 700,
          easing: EASE_OUT,
        });
      }, 2200);
    }, 100);
    return () => clearTimeout(timer);
    // Shared values are stable refs — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Video end → return and transition ────────────────────────

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reanimated shared values are stable refs
  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      if (!isAnimatingRef.current) return;

      // Crossfade back to static image
      staticImageOpacity.value = withTiming(1, {
        duration: 400,
        easing: EASE_OUT,
      });
      videoOpacity.value = withTiming(0, { duration: 400, easing: EASE_OUT });

      // Circle scales back with spring
      circleScale.value = withTiming(1, { duration: 600, easing: EASE_SPRING });
      circleGlow.value = withTiming(0, { duration: 600 });

      // Transition after animations settle
      setTimeout(onReady, 650);
    });
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, onReady]);

  // ── Button press → start animation ──────────────────────────

  const handleReady = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Fade button out
    buttonOpacity.value = withTiming(0, { duration: 250, easing: EASE_OUT });

    // Circle springs up
    circleScale.value = withTiming(1.4, { duration: 700, easing: EASE_SPRING });
    circleGlow.value = withTiming(1, { duration: 700 });

    // Crossfade static image → video
    staticImageOpacity.value = withTiming(0, {
      duration: 300,
      easing: EASE_OUT,
    });
    videoOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 300, easing: EASE_OUT }),
    );

    // Play video after fade starts
    setTimeout(() => player.play(), 150);
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />

      <Pressable
        style={settingsButtonStyle}
        onPress={() => setShowSettings(true)}
      >
        <Ionicons
          name="earth-outline"
          size={22}
          color="rgba(255,255,255,0.9)"
        />
      </Pressable>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <Animated.View
        style={[styles.pandaImageWrapper, imageStyle, circleWrapperStyle]}
      >
        {/* Static image */}
        <Animated.View style={[StyleSheet.absoluteFill, staticImageStyle]}>
          <Image
            source={require("@/assets/modi.jpeg")}
            style={styles.pandaImage}
            contentFit="cover"
          />
        </Animated.View>

        {/* Video — always mounted so the player has a view attached */}
        <Animated.View style={[StyleSheet.absoluteFill, videoStyle]}>
          <VideoView
            player={player}
            style={styles.pandaImage}
            contentFit="cover"
            nativeControls={false}
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.intentionContainer}>
        <Animated.Text style={[styles.intentionText, text1Style]}>
          {t("start.takeBreath")}
        </Animated.Text>
        <Animated.Text style={[styles.intentionText, text2Style]}>
          {t("start.thinkQuestion")}
        </Animated.Text>
      </View>

      <View style={{ minHeight: 70, justifyContent: "center" }}>
        {showButton && (
          <Animated.View style={buttonStyle}>
            <Pressable style={styles.primaryButton} onPress={handleReady}>
              <Text style={styles.primaryButtonText}>{t("start.ready")}</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const settingsButtonStyle: import("react-native").ViewStyle = {
  position: "absolute",
  top: 52,
  right: 16,
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(255,255,255,0.25)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
  borderWidth: 1.5,
  borderColor: "rgba(255,255,255,0.35)",
};
