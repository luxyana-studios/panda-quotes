import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { styles } from '@/styles/index.styles';

const ANIMATION_TIMINGS = {
  textFadeIn: 1500,
  textDelay: 1500,
  buttonFadeIn: 800,
};

interface StartScreenProps {
  onReady: () => void;
}

export function StartScreen({ onReady }: StartScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const buttonEnabled = useSharedValue(false);
  const intentionText1Opacity = useSharedValue(0);
  const intentionText2Opacity = useSharedValue(0);
  const intentionButtonOpacity = useSharedValue(0);

  const intentionText1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionText1Opacity.value,
  }));

  const intentionText2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionText2Opacity.value,
  }));

  const intentionButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionButtonOpacity.value,
    transform: [{ scale: intentionButtonOpacity.value }],
  }));

  useEffect(() => {
    intentionText1Opacity.value = withTiming(1, {
      duration: ANIMATION_TIMINGS.textFadeIn,
    });
    intentionText2Opacity.value = withDelay(
      ANIMATION_TIMINGS.textDelay,
      withTiming(1, { duration: 1000 })
    );

    // Show button and start animation after delay
    const timer = setTimeout(() => {
      setShowButton(true);
      intentionButtonOpacity.value = withTiming(1, {
        duration: ANIMATION_TIMINGS.buttonFadeIn,
      });
      buttonEnabled.value = true;
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/modi.jpeg')}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <View style={styles.intentionContainer}>
        <Animated.Text
          style={[styles.intentionText, intentionText1AnimatedStyle]}
        >
          Take a breath.
        </Animated.Text>
        <Animated.Text
          style={[styles.intentionText, intentionText2AnimatedStyle]}
        >
          Think of a question or situation.
        </Animated.Text>
      </View>

      <View style={{ minHeight: 60, justifyContent: 'center' }}>
        {showButton && (
          <Animated.View style={intentionButtonAnimatedStyle}>
            <Pressable style={styles.primaryButton} onPress={onReady}>
              <Text style={styles.primaryButtonText}>I'm ready</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
