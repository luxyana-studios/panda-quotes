import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { styles } from '@/styles/index.styles';

interface TakeInScreenProps {
  currentQuote: string;
  onSitWithThis: () => void;
  onDrawWisdom: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function TakeInScreen({
  currentQuote,
  onSitWithThis,
  onDrawWisdom,
}: TakeInScreenProps) {
  const [showButtons, setShowButtons] = useState(false);

  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.9);
  const quoteOpacity = useSharedValue(0);
  const quoteTranslateY = useSharedValue(20);
  const authorOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(16);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const quoteStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
    transform: [{ translateY: quoteTranslateY.value }],
  }));

  const authorStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      imageOpacity.value = withTiming(1, { duration: 800, easing: EASE_OUT });
      imageScale.value = withTiming(1, { duration: 800, easing: EASE_OUT });

      quoteOpacity.value = withDelay(500, withTiming(1, { duration: 1000, easing: EASE_OUT }));
      quoteTranslateY.value = withDelay(500, withTiming(0, { duration: 1000, easing: EASE_OUT }));

      authorOpacity.value = withDelay(1200, withTiming(1, { duration: 800, easing: EASE_OUT }));

      setTimeout(() => {
        setShowButtons(true);
        buttonOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
        buttonTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
      }, 2000);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />

      <Animated.View style={[styles.pandaImageWrapper, imageStyle]}>
        <Image
          source={require('@/assets/modi.jpeg')}
          style={styles.pandaImage}
          contentFit="cover"
        />
      </Animated.View>

      <Animated.View style={[styles.quoteContainer, quoteStyle]}>
        <Text style={styles.quoteText}>{currentQuote}</Text>
        <Animated.Text style={[styles.author, authorStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </Animated.View>

      <View style={{ minHeight: 120, justifyContent: 'center' }}>
        {showButtons && (
          <Animated.View style={buttonStyle}>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.primaryButton} onPress={onSitWithThis}>
                <Text style={styles.primaryButtonText}>{"I'll sit with this"}</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={onDrawWisdom}>
                <Text style={styles.secondaryButtonText}>
                  Ask another question
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
