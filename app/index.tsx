import { useState } from "react";
import { RED_PANDA_QUOTES } from "@/constants/quotes";
import { StartScreen } from "@/components/StartScreen";
import { TakeInScreen } from "@/components/TakeInScreen";
import { ContemplateScreen } from "@/components/ContemplateScreen";

// ============================================
// TYPES
// ============================================
type Screen = 'start' | 'takeIn' | 'contemplate';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * RED_PANDA_QUOTES.length)
  );
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const handleReady = () => {
    setCurrentScreen('takeIn');
  };

  const handleSitWithThis = () => {
    setCurrentScreen('contemplate');
  };

  const handleClose = () => {
    setCurrentScreen('start');
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
  };

  switch (currentScreen) {
    case 'start':
      return <StartScreen onReady={handleReady} />;
    case 'takeIn':
      return (
        <TakeInScreen
          currentQuote={RED_PANDA_QUOTES[currentQuoteIndex]}
          onSitWithThis={handleSitWithThis}
          onDrawWisdom={shuffleQuote}
        />
      );
    case 'contemplate':
      return (
        <ContemplateScreen
          currentQuote={RED_PANDA_QUOTES[currentQuoteIndex]}
          onMoveOn={handleClose}
        />
      );
  }
}
