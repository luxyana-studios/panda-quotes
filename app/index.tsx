import { useState, useEffect } from "react";
import { StartScreen } from "@/components/StartScreen";
import { TakeInScreen } from "@/components/TakeInScreen";
import { ContemplateScreen } from "@/components/ContemplateScreen";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useQuoteManager } from "@/hooks/useQuoteManager";
import { rescheduleNotificationsIfNeeded } from "@/services/notifications";

type Screen = 'onboarding' | 'start' | 'takeIn' | 'contemplate';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const { currentQuote, getNextQuote } = useQuoteManager();

  useEffect(() => {
    rescheduleNotificationsIfNeeded();
  }, []);

  const handleReady = () => {
    setCurrentScreen('takeIn');
  };

  const handleSitWithThis = () => {
    setCurrentScreen('contemplate');
  };

  const handleClose = () => {
    getNextQuote();
    setCurrentScreen('start');
  };

  const handleDrawWisdom = () => {
    getNextQuote();
    setCurrentScreen('start');
  };

  switch (currentScreen) {
    case 'onboarding':
      return <OnboardingFlow onComplete={() => setCurrentScreen('start')} />;
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
