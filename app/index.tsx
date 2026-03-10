import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StartScreen } from "@/components/StartScreen";
import { TakeInScreen } from "@/components/TakeInScreen";
import { ContemplateScreen } from "@/components/ContemplateScreen";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useQuoteManager } from "@/hooks/useQuoteManager";
import { rescheduleNotificationsIfNeeded } from "@/services/notifications";

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

type Screen = 'onboarding' | 'start' | 'takeIn' | 'contemplate';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const { currentQuote, getNextQuote } = useQuoteManager();

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY).then((value) => {
      setCurrentScreen(value === 'true' ? 'start' : 'onboarding');
    });
    rescheduleNotificationsIfNeeded();
  }, []);

  if (currentScreen === null) return null;

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
      return (
        <OnboardingFlow
          onComplete={() => {
            AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
            setCurrentScreen('start');
          }}
        />
      );
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
