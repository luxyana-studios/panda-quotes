import { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface WelcomeScreenProps {
  onNext: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const imageOpacity = useSharedValue(0);
  const imageTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const dividerOpacity = useSharedValue(0);
  const dividerScale = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(24);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ translateY: imageTranslateY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    opacity: dividerOpacity.value,
    transform: [{ scaleX: dividerScale.value }],
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ translateY: descriptionTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const dur = 900;
      const stagger = 250;

      imageOpacity.value = withTiming(1, { duration: dur, easing: EASE_OUT });
      imageTranslateY.value = withTiming(0, { duration: dur, easing: EASE_OUT });

      titleOpacity.value = withDelay(stagger, withTiming(1, { duration: dur, easing: EASE_OUT }));
      titleTranslateY.value = withDelay(stagger, withTiming(0, { duration: dur, easing: EASE_OUT }));

      subtitleOpacity.value = withDelay(stagger * 2, withTiming(1, { duration: dur, easing: EASE_OUT }));
      subtitleTranslateY.value = withDelay(stagger * 2, withTiming(0, { duration: dur, easing: EASE_OUT }));

      dividerOpacity.value = withDelay(stagger * 3, withTiming(1, { duration: 600, easing: EASE_OUT }));
      dividerScale.value = withDelay(stagger * 3, withTiming(1, { duration: 600, easing: EASE_OUT }));

      descriptionOpacity.value = withDelay(stagger * 4, withTiming(1, { duration: dur, easing: EASE_OUT }));
      descriptionTranslateY.value = withDelay(stagger * 4, withTiming(0, { duration: dur, easing: EASE_OUT }));

      buttonOpacity.value = withDelay(stagger * 5, withTiming(1, { duration: dur, easing: EASE_OUT }));
      buttonTranslateY.value = withDelay(stagger * 5, withTiming(0, { duration: dur, easing: EASE_OUT }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeTopDecoration} />
      <View style={styles.welcomeBottomDecoration} />

      <View style={styles.welcomeContent}>
        <Animated.View style={[styles.welcomeImageWrapper, imageStyle]}>
          <Image
            source={require('@/assets/modi.jpeg')}
            style={styles.welcomePandaImage}
            contentFit="cover"
          />
        </Animated.View>

        <Animated.Text style={[styles.welcomeTitle, titleStyle]}>
          {"Hey, I'm Modi!"}
        </Animated.Text>

        <Animated.Text style={[styles.welcomeSubtitle, subtitleStyle]}>
          {"I'm here to share some wisdom"}
        </Animated.Text>

        <Animated.View style={[styles.welcomeDivider, dividerStyle]} />

        <Animated.Text style={[styles.welcomeDescription, descriptionStyle]}>
          {"Every day, I'll bring you thoughtful quotes to inspire reflection and bring a little peace to your day."}
        </Animated.Text>

        <Animated.View style={buttonStyle}>
          <Pressable style={styles.getStartedButton} onPress={onNext}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
