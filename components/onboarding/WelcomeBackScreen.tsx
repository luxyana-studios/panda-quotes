import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface WelcomeBackScreenProps {
  onComplete: () => void;
}

export function WelcomeBackScreen({ onComplete }: WelcomeBackScreenProps) {
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  useEffect(() => {
    // Defer to ensure native views are mounted before animating
    const animTimer = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 800 });
      subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    }, 100);
    const completeTimer = setTimeout(onComplete, 2500);
    return () => {
      clearTimeout(animTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <View style={styles.welcomeBackContainer}>
      <Animated.Text style={[styles.welcomeBackTitle, titleStyle]}>
        Welcome!
      </Animated.Text>
      <Animated.Text style={[styles.welcomeBackSubtitle, subtitleStyle]}>
        Your daily wisdom awaits
      </Animated.Text>
    </View>
  );
}
