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

interface StartScreenProps {
  onReady: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function StartScreen({ onReady }: StartScreenProps) {
  const [showButton, setShowButton] = useState(false);

  const imageOpacity = useSharedValue(0);
  const imageTranslateY = useSharedValue(20);
  const text1Opacity = useSharedValue(0);
  const text1TranslateY = useSharedValue(16);
  const text2Opacity = useSharedValue(0);
  const text2TranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      imageOpacity.value = withTiming(1, { duration: 900, easing: EASE_OUT });
      imageTranslateY.value = withTiming(0, { duration: 900, easing: EASE_OUT });

      text1Opacity.value = withDelay(400, withTiming(1, { duration: 900, easing: EASE_OUT }));
      text1TranslateY.value = withDelay(400, withTiming(0, { duration: 900, easing: EASE_OUT }));

      text2Opacity.value = withDelay(1200, withTiming(1, { duration: 900, easing: EASE_OUT }));
      text2TranslateY.value = withDelay(1200, withTiming(0, { duration: 900, easing: EASE_OUT }));

      setTimeout(() => {
        setShowButton(true);
        buttonOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
        buttonTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
      }, 2200);
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

      <View style={styles.intentionContainer}>
        <Animated.Text style={[styles.intentionText, text1Style]}>
          Take a breath.
        </Animated.Text>
        <Animated.Text style={[styles.intentionText, text2Style]}>
          Think of a question or situation.
        </Animated.Text>
      </View>

      <View style={{ minHeight: 70, justifyContent: 'center' }}>
        {showButton && (
          <Animated.View style={buttonStyle}>
            <Pressable style={styles.primaryButton} onPress={onReady}>
              <Text style={styles.primaryButtonText}>{"I'm ready"}</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
