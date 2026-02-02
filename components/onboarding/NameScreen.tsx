import { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface NameScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function NameScreen({ onNext, onBack }: NameScreenProps) {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      contentTranslateY.value = withTiming(0, { duration: 700, easing: EASE_OUT });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>About You</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Animated.View style={[styles.screenContent, contentStyle]}>
        <View style={styles.smallPandaWrapper}>
          <Image
            source={require('@/assets/modi.jpeg')}
            style={styles.smallPandaImage}
            contentFit="cover"
          />
        </View>

        <Text style={styles.heading}>{"What's your name?"}</Text>
        <Text style={styles.subtitle}>
          {"I'd love to get to know you better!"}
        </Text>

        <View style={styles.textInputWrapper}>
          <Text style={styles.textInputLabel}>Your Name</Text>
          <TextInput
            style={[styles.textInput, focused && styles.textInputFocused]}
            placeholder="Enter your name"
            placeholderTextColor="#c4bbb0"
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </Animated.View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
