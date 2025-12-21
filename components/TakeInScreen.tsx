import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { styles } from "@/styles/index.styles";

const ANIMATION_TIMINGS = {
  textFadeIn: 1500,
  textDelay: 1500,
  buttonFadeIn: 800,
};

interface TakeInScreenProps {
  currentQuote: string;
  onSitWithThis: () => void;
  onDrawWisdom: () => void;
}

export function TakeInScreen({
  currentQuote,
  onSitWithThis,
  onDrawWisdom,
}: TakeInScreenProps) {
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const quoteOpacity = useSharedValue(0);
  const authorOpacity = useSharedValue(0);
  const quoteButtonOpacity = useSharedValue(0);

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const authorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const quoteButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteButtonOpacity.value,
  }));

  useEffect(() => {
    quoteOpacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn });
    authorOpacity.value = withDelay(
      ANIMATION_TIMINGS.textDelay,
      withTiming(1, { duration: 1000 })
    );
    quoteButtonOpacity.value = withDelay(
      2500,
      withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn })
    );

    // Enable buttons after fade-in completes
    const timer = setTimeout(() => {
      setButtonsEnabled(true);
    }, 2500 + ANIMATION_TIMINGS.buttonFadeIn);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <View style={styles.quoteContainer}>
        <Animated.Text style={[styles.quoteText, quoteAnimatedStyle]}>
          {currentQuote}
        </Animated.Text>
        <Animated.Text style={[styles.author, authorAnimatedStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </View>

      <Animated.View style={quoteButtonAnimatedStyle}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.primaryButton} onPress={onSitWithThis} disabled={!buttonsEnabled}>
            <Text style={styles.primaryButtonText}>I'll sit with this</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onDrawWisdom} disabled={!buttonsEnabled}>
            <Text style={styles.secondaryButtonText}>Ask another question</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
