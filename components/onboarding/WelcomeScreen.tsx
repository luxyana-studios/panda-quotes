import { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: 0.8 + 0.2 * buttonOpacity.value }],
  }));

  useEffect(() => {
    // Defer to ensure native views are mounted before animating
    const timer = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 1000 });
      subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
      descriptionOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
      buttonOpacity.value = withDelay(1800, withTiming(1, { duration: 800 }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.welcomeContainer}>
      <Image
        source={require('@/assets/modi.jpeg')}
        style={styles.welcomePandaImage}
        contentFit="contain"
      />

      <Animated.Text style={[styles.welcomeTitle, titleStyle]}>
        {"Hey, I'm Modi!"}
      </Animated.Text>

      <Animated.Text style={[styles.welcomeSubtitle, subtitleStyle]}>
        {"I'm here to share some wisdom"}
      </Animated.Text>

      <Animated.Text style={[styles.welcomeDescription, descriptionStyle]}>
        {"Every day, I'll bring you thoughtful quotes to inspire reflection and bring a little peace to your day."}
      </Animated.Text>

      <Animated.View style={buttonStyle}>
        <Pressable style={styles.getStartedButton} onPress={onNext}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
