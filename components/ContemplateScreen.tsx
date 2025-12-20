import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { styles } from "@/app/index.styles";

const ANIMATION_TIMINGS = {
  textFadeIn: 1500,
  textDelay: 1500,
  buttonFadeIn: 800,
  completionDelay: 8000,
};

interface ContemplateScreenProps {
  currentQuote: string;
  onMoveOn: () => void;
}

export function ContemplateScreen({
  currentQuote,
  onMoveOn,
}: ContemplateScreenProps) {
  const [showMoveOnButton, setShowMoveOnButton] = useState(false);
  const closingMessageOpacity = useSharedValue(0);
  const quoteOpacity = useSharedValue(0);
  const authorOpacity = useSharedValue(0);
  const moveOnButtonOpacity = useSharedValue(0);

  const closingMessageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: closingMessageOpacity.value,
  }));

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const authorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const moveOnButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: moveOnButtonOpacity.value,
  }));

  useEffect(() => {
    // Animate closing message and quote
    closingMessageOpacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn });
    quoteOpacity.value = withDelay(
      ANIMATION_TIMINGS.textDelay,
      withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn })
    );
    authorOpacity.value = withDelay(
      ANIMATION_TIMINGS.textDelay * 2,
      withTiming(1, { duration: 1000 })
    );

    // Show move on button after delay
    const timer = setTimeout(() => {
      setShowMoveOnButton(true);
      moveOnButtonOpacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn });
    }, ANIMATION_TIMINGS.completionDelay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <Animated.Text style={[styles.closingMessage, closingMessageAnimatedStyle]}>
        Carry this thought with you.
      </Animated.Text>

      <View style={styles.quoteContainer}>
        <Animated.Text style={[styles.quoteText, quoteAnimatedStyle]}>
          {currentQuote}
        </Animated.Text>
        <Animated.Text style={[styles.author, authorAnimatedStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </View>

      <Animated.View style={moveOnButtonAnimatedStyle}>
        <Pressable
          style={styles.primaryButton}
          onPress={onMoveOn}
          disabled={!showMoveOnButton}
        >
          <Text style={styles.primaryButtonText}>I'm ready to move on now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
