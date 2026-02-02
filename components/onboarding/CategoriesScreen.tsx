import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

const CATEGORIES = [
  'Wisdom',
  'Patience',
  'Joy',
  'Nature',
  'Humor',
  'Courage',
  'Peace',
  'Growth',
  'Resilience',
  'Self-discovery',
];

interface CategoriesScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

function CategoryChip({
  label,
  selected,
  onPress,
  delay,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  delay: number;
}) {
  const scale = useSharedValue(1);
  const chipOpacity = useSharedValue(0);
  const chipTranslateY = useSharedValue(12);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: chipTranslateY.value }],
    opacity: chipOpacity.value,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      chipOpacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: EASE_OUT }));
      chipTranslateY.value = withDelay(delay, withTiming(0, { duration: 500, easing: EASE_OUT }));
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 12, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={handlePress}
      >
        {selected && <Text style={styles.chipCheckmark}>{'\u2713'}</Text>}
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function CategoriesScreen({
  onNext,
  onBack,
  onSkip,
}: CategoriesScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const headerOpacity = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      headerOpacity.value = withTiming(1, { duration: 600, easing: EASE_OUT });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (category: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Categories</Text>
        <Pressable style={styles.headerSkipButton} onPress={onSkip}>
          <Text style={styles.headerSkipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDotActive} />
        <View style={styles.progressDot} />
      </View>

      <View style={styles.screenContent}>
        <Animated.View style={headerStyle}>
          <View style={styles.smallPandaWrapper}>
            <Image
              source={require('@/assets/modi.jpeg')}
              style={styles.smallPandaImage}
              contentFit="cover"
            />
          </View>

          <Text style={styles.heading}>What brings you joy?</Text>
          <Text style={styles.subtitle}>
            {"Choose the themes you'd like to explore"}
          </Text>
        </Animated.View>

        <View style={styles.chipGrid}>
          {CATEGORIES.map((cat, i) => (
            <CategoryChip
              key={cat}
              label={cat}
              selected={selected.has(cat)}
              onPress={() => toggleCategory(cat)}
              delay={i * 60}
            />
          ))}
        </View>

        {selected.size > 0 && (
          <Text style={styles.chipCount}>
            {selected.size} {selected.size === 1 ? 'theme' : 'themes'} selected
          </Text>
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
