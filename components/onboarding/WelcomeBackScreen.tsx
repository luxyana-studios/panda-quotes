import { useEffect } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface WelcomeBackScreenProps {
  onComplete: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function WelcomeBackScreen({ onComplete }: WelcomeBackScreenProps) {
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.7);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(16);
  const subtitleOpacity = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  useEffect(() => {
    const animTimer = setTimeout(() => {
      imageOpacity.value = withTiming(1, { duration: 800, easing: EASE_OUT });
      imageScale.value = withTiming(1, { duration: 800, easing: EASE_OUT });

      titleOpacity.value = withDelay(400, withTiming(1, { duration: 700, easing: EASE_OUT }));
      titleTranslateY.value = withDelay(400, withTiming(0, { duration: 700, easing: EASE_OUT }));

      subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 700, easing: EASE_OUT }));
      dotsOpacity.value = withDelay(1000, withTiming(1, { duration: 600, easing: EASE_OUT }));
    }, 100);
    const completeTimer = setTimeout(onComplete, 2800);
    return () => {
      clearTimeout(animTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <View style={styles.welcomeBackContainer}>
      <View style={styles.welcomeBackDecoration} />

      <Animated.View style={[styles.welcomeBackImageWrapper, imageStyle]}>
        <Image
          source={require('@/assets/modi.jpeg')}
          style={styles.welcomeBackPandaImage}
          contentFit="cover"
        />
      </Animated.View>

      <Animated.Text style={[styles.welcomeBackTitle, titleStyle]}>
        Welcome!
      </Animated.Text>
      <Animated.Text style={[styles.welcomeBackSubtitle, subtitleStyle]}>
        Your daily wisdom awaits
      </Animated.Text>

      <Animated.View style={[styles.welcomeBackDots, dotsStyle]}>
        <View style={styles.welcomeBackDot} />
        <View style={styles.welcomeBackDot} />
        <View style={styles.welcomeBackDot} />
      </Animated.View>
    </View>
  );
}
