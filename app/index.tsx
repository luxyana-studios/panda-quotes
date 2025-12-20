import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  SharedValue,
} from "react-native-reanimated";

// ============================================
// TYPES & CONSTANTS
// ============================================
type Screen = 'start' | 'takeIn' | 'contemplate';

const ANIMATION_TIMINGS = {
  textFadeIn: 1500,
  textDelay: 1500,
  buttonFadeIn: 800,
  completionDelay: 8000,
};

const RED_PANDA_QUOTES = [
  "Bamboo may bend, but wisdom remains rooted in the earth.",
  "The tree that offers the sweetest fruit is climbed by those who dare to reach.",
  "In stillness, we find our true nature; in play, we discover our joy.",
  "A gentle paw can move mountains when guided by patient determination.",
  "The wisest climb is not the fastest, but the one where each branch is cherished.",
  "Sleep when the sun is high, for the coolest thoughts come with the evening breeze.",
  "To share your bamboo is to multiply its sweetness tenfold.",
  "The forest teaches us that strength lies not in size, but in adaptability.",
  "The branch that holds you today was once a fragile shoot reaching for the sky.",
  "In the canopy of life, every creature finds their perfect height.",
  "A fluffy tail is nature's reminder that warmth comes from within.",
  "The river does not rush to the sea; neither should wisdom hurry to reveal itself.",
  "When the path grows steep, remember: even mountains rest in valleys.",
  "The sweetest berries grow where patience and sunlight meet.",
  "A single paw print in snow tells the story of a thousand careful steps.",
  "The wise tree-dweller knows that looking down is as important as looking up.",
  "In the quiet of morning mist, the forest whispers truths the day will hide.",
  "Every nap is a meditation; every stretch, a prayer to flexibility.",
  "The strongest grip is gentle enough to feel the heartbeat of the tree.",
  "Curiosity climbs higher than fear ever could.",
  "When two paths diverge in the bamboo grove, take the one less trampled.",
  "The moon sees all our midnight snacks and judges not.",
  "A warm branch shared is worth more than a perfect perch alone.",
  "Let your inner fire burn bright, even when your fur gets wet.",
  "The forest has no schedule, yet every season arrives on time.",
  "Balance is not standing still, but knowing when to sway with the wind.",
  "The smallest creature can cast the longest shadow when the light is right.",
  "Solitude in the treetops teaches what crowds on the ground cannot.",
  "He who naps with intention awakens with clarity. He who just naps also awakens, eventually.",
  "The universe provides bamboo, but you must still climb to reach it.",
  "A philosopher who cannot touch their toes has not yet mastered the art of reaching.",
  "Wisdom is knowing you're adorable; enlightenment is not letting it go to your head.",
  "The student asks: 'Master, what is the meaning of life?' The master replies: 'Have you tried napping on it?'",
  "In the depths of winter, I finally learned that within me there lay an invincible appetite.",
  "Do not mistake my climbing for fleeing; sometimes wisdom requires higher ground.",
  "The fool sees rain and complains. The wise see rain and find the driest branch.",
  "Those who say size doesn't matter have never tried to intimidate with a fluffy tail.",
  "Time spent grooming your tail is never wasted; presentability precedes credibility.",
  "If a tree falls in the forest and no red panda was napping in it, does it even matter?",
  "The path to enlightenment is long, winding, and best traveled with snacks.",
  "Before you judge another's choices, remember: you're not the one sleeping in their tree.",
  "The ancient texts speak of balance, but they forgot to mention that sometimes you just slip.",
  "True mastery is yawning without losing your grip on the branch.",
  "One cannot find inner peace on an empty stomach, nor outer peace while digesting.",
  "The greatest battles are fought not with claws, but with the strategic deployment of cuteness.",
  "Seek not to find yourself, but to lose yourself in the simple joy of a perfectly positioned sunbeam.",
  "The wise know that every expert was once a beginner who fell out of many trees.",
];

// ============================================
// SCREEN COMPONENTS
// ============================================

interface StartScreenProps {
  intentionText1Opacity: SharedValue<number>;
  intentionText2Opacity: SharedValue<number>;
  intentionButtonOpacity: SharedValue<number>;
  onReady: () => void;
}

function StartScreen({
  intentionText1Opacity,
  intentionText2Opacity,
  intentionButtonOpacity,
  onReady,
}: StartScreenProps) {
  const intentionText1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionText1Opacity.value,
  }));

  const intentionText2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionText2Opacity.value,
  }));

  const intentionButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: intentionButtonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <View style={styles.intentionContainer}>
        <Animated.Text style={[styles.intentionText, intentionText1AnimatedStyle]}>
          Take a breath.
        </Animated.Text>
        <Animated.Text style={[styles.intentionText, intentionText2AnimatedStyle]}>
          Think of a question or situation.
        </Animated.Text>
      </View>

      <Animated.View style={intentionButtonAnimatedStyle}>
        <Pressable style={styles.primaryButton} onPress={onReady}>
          <Text style={styles.primaryButtonText}>I'm ready</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

interface TakeInScreenProps {
  currentQuote: string;
  quoteOpacity: SharedValue<number>;
  authorOpacity: SharedValue<number>;
  quoteButtonOpacity: SharedValue<number>;
  onSitWithThis: () => void;
  onDrawWisdom: () => void;
}

function TakeInScreen({
  currentQuote,
  quoteOpacity,
  authorOpacity,
  quoteButtonOpacity,
  onSitWithThis,
  onDrawWisdom,
}: TakeInScreenProps) {
  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const authorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const quoteButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteButtonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <View style={styles.quoteContainer}>
        <Animated.Text style={[styles.quoteText, quoteAnimatedStyle]}>
          {currentQuote}
        </Animated.Text>
        <Animated.Text style={[styles.author, authorAnimatedStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </View>

      <Animated.View style={quoteButtonAnimatedStyle}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.primaryButton} onPress={onSitWithThis}>
            <Text style={styles.primaryButtonText}>I'll sit with this</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onDrawWisdom}>
            <Text style={styles.secondaryButtonText}>Draw wisdom</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

interface ContemplateScreenProps {
  currentQuote: string;
  quoteOpacity: SharedValue<number>;
  authorOpacity: SharedValue<number>;
  moveOnButtonOpacity: SharedValue<number>;
  showMoveOnButton: boolean;
  onMoveOn: () => void;
}

function ContemplateScreen({
  currentQuote,
  quoteOpacity,
  authorOpacity,
  moveOnButtonOpacity,
  showMoveOnButton,
  onMoveOn,
}: ContemplateScreenProps) {
  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const authorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const moveOnButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: moveOnButtonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <Text style={styles.closingMessage}>Carry this thought with you.</Text>

      <View style={styles.quoteContainer}>
        <Animated.Text style={[styles.quoteText, quoteAnimatedStyle]}>
          {currentQuote}
        </Animated.Text>
        <Animated.Text style={[styles.author, authorAnimatedStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </View>

      <Animated.View style={moveOnButtonAnimatedStyle}>
        <Pressable
          style={styles.primaryButton}
          onPress={onMoveOn}
          disabled={!showMoveOnButton}
        >
          <Text style={styles.primaryButtonText}>I'm ready to move on now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * RED_PANDA_QUOTES.length)
  );
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const quoteOpacity = useSharedValue(0);
  const authorOpacity = useSharedValue(0);
  const intentionText1Opacity = useSharedValue(0);
  const intentionText2Opacity = useSharedValue(0);
  const intentionButtonOpacity = useSharedValue(0);
  const quoteButtonOpacity = useSharedValue(0);
  const moveOnButtonOpacity = useSharedValue(0);

  const handleReady = () => {
    setCurrentScreen('takeIn');

    // Start animations when quote appears
    quoteOpacity.value = 0;
    authorOpacity.value = 0;
    quoteButtonOpacity.value = 0;

    quoteOpacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn });
    authorOpacity.value = withDelay(ANIMATION_TIMINGS.textDelay, withTiming(1, { duration: 1000 }));
    quoteButtonOpacity.value = withDelay(2500, withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn }));
  };

  const handleSitWithThis = () => {
    setCurrentScreen('contemplate');
    setShowCloseButton(false);

    // Show move on button after delay
    moveOnButtonOpacity.value = 0;
    setTimeout(() => {
      setShowCloseButton(true);
      moveOnButtonOpacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn });
    }, ANIMATION_TIMINGS.completionDelay);
  };

  const handleClose = () => {
    setCurrentScreen('start');
    setShowCloseButton(false);
  };

  const shuffleQuote = () => {
    // Get available indices (not yet used)
    let availableIndices = [];
    for (let i = 0; i < RED_PANDA_QUOTES.length; i++) {
      if (!usedIndices.includes(i) && i !== currentQuoteIndex) {
        availableIndices.push(i);
      }
    }

    // If all quotes have been used, reset
    if (availableIndices.length === 0) {
      availableIndices = [];
      for (let i = 0; i < RED_PANDA_QUOTES.length; i++) {
        if (i !== currentQuoteIndex) {
          availableIndices.push(i);
        }
      }
      setUsedIndices([]);
    }

    // Pick random index from available
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const nextIndex = availableIndices[randomIndex];

    setCurrentQuoteIndex(nextIndex);
    setUsedIndices([...usedIndices, nextIndex]);
    setCurrentScreen('start');

    // Start intention screen animations
    intentionText1Opacity.value = 0;
    intentionText2Opacity.value = 0;
    intentionButtonOpacity.value = 0;

    intentionText1Opacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn });
    intentionText2Opacity.value = withDelay(ANIMATION_TIMINGS.textDelay, withTiming(1, { duration: 1000 }));
    intentionButtonOpacity.value = withDelay(2500, withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn }));
  };

  // Trigger intention animations on mount
  useEffect(() => {
    if (currentScreen === 'start') {
      intentionText1Opacity.value = 0;
      intentionText2Opacity.value = 0;
      intentionButtonOpacity.value = 0;

      intentionText1Opacity.value = withTiming(1, { duration: ANIMATION_TIMINGS.textFadeIn });
      intentionText2Opacity.value = withDelay(ANIMATION_TIMINGS.textDelay, withTiming(1, { duration: 1000 }));
      intentionButtonOpacity.value = withDelay(2500, withTiming(1, { duration: ANIMATION_TIMINGS.buttonFadeIn }));
    }
  }, [currentScreen]);

  switch (currentScreen) {
    case 'start':
      return (
        <StartScreen
          intentionText1Opacity={intentionText1Opacity}
          intentionText2Opacity={intentionText2Opacity}
          intentionButtonOpacity={intentionButtonOpacity}
          onReady={handleReady}
        />
      );
    case 'takeIn':
      return (
        <TakeInScreen
          currentQuote={RED_PANDA_QUOTES[currentQuoteIndex]}
          quoteOpacity={quoteOpacity}
          authorOpacity={authorOpacity}
          quoteButtonOpacity={quoteButtonOpacity}
          onSitWithThis={handleSitWithThis}
          onDrawWisdom={shuffleQuote}
        />
      );
    case 'contemplate':
      return (
        <ContemplateScreen
          currentQuote={RED_PANDA_QUOTES[currentQuoteIndex]}
          quoteOpacity={quoteOpacity}
          authorOpacity={authorOpacity}
          moveOnButtonOpacity={moveOnButtonOpacity}
          showMoveOnButton={showCloseButton}
          onMoveOn={handleClose}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F0",
    padding: 20,
    gap: 20,
  },
  pandaImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#C85A3F",
  },
  quoteContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 400,
  },
  quoteText: {
    fontSize: 24,
    lineHeight: 36,
    color: "#2D2D2D",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 16,
  },
  author: {
    fontSize: 16,
    color: "#666666",
    textAlign: "right",
  },
  buttonContainer: {
    gap: 12,
    alignItems: "center",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
  },
  completionContainer: {
    gap: 20,
    alignItems: "center",
  },
  closingMessage: {
    fontSize: 16,
    color: "#666666",
    fontStyle: "italic",
    textAlign: "center",
  },
  intentionContainer: {
    paddingHorizontal: 40,
    gap: 12,
  },
  intentionText: {
    fontSize: 20,
    lineHeight: 32,
    color: "#2D2D2D",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#C85A3F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
