import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { TakeInScreen } from "@/components/TakeInScreen";
import { ContemplateScreen } from "@/components/ContemplateScreen";
import { useQuoteManager } from "@/hooks/useQuoteManager";

// ============================================
// TYPES
// ============================================
type Screen = 'start' | 'takeIn' | 'contemplate';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const { currentQuote, getNextQuote } = useQuoteManager();

  const handleReady = () => {
    setCurrentScreen('takeIn');
  };

  const handleSitWithThis = () => {
    setCurrentScreen('contemplate');
  };

  const handleClose = () => {
    setCurrentScreen('start');
  };

  const handleDrawWisdom = () => {
    getNextQuote();
    setCurrentScreen('start');
  };

  switch (currentScreen) {
    case 'start':
      return <StartScreen onReady={handleReady} />;
    case 'takeIn':
      return (
        <TakeInScreen
          currentQuote={currentQuote}
          onSitWithThis={handleSitWithThis}
          onDrawWisdom={handleDrawWisdom}
        />
      );
    case 'contemplate':
      return (
        <ContemplateScreen
          currentQuote={currentQuote}
          onMoveOn={handleClose}
        />
      );
  }
}
