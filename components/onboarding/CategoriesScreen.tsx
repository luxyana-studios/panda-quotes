import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
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
        <Text style={styles.chipText}>{label}</Text>
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

      <View style={styles.screenContent}>
        <Image
          source={require('@/assets/modi.jpeg')}
          style={styles.smallPandaImage}
          contentFit="contain"
        />

        <Text style={styles.heading}>What brings you joy?</Text>
        <Text style={styles.subtitle}>
          {"Choose the themes you'd like to explore"}
        </Text>

        <View style={styles.chipGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              selected={selected.has(cat)}
              onPress={() => toggleCategory(cat)}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
