import { useState, useEffect } from "react";
import {
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { RED_PANDA_QUOTES } from "@/constants/quotes";
import { StartScreen } from "@/components/StartScreen";
import { TakeInScreen } from "@/components/TakeInScreen";
import { ContemplateScreen } from "@/components/ContemplateScreen";

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
