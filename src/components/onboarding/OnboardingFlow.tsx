import { useState } from "react";
import { useSettingsStore } from "@/features/settings/stores/settings.store";
import { NameScreen } from "./NameScreen";
import { NotificationsScreen } from "./NotificationsScreen";
import { WelcomeBackScreen } from "./WelcomeBackScreen";
import { WelcomeScreen } from "./WelcomeScreen";

type OnboardingStep = "welcome" | "name" | "notifications" | "welcomeBack";

const STEPS: OnboardingStep[] = [
  "welcome",
  "name",
  "notifications",
  "welcomeBack",
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const settings = useSettingsStore();

  const currentStep = STEPS[stepIndex];

  const goNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    settings.setOnboardingCompleted(true);
    onComplete();
  };

  const handleSkipNotifications = () => {
    settings.setNotificationPrefs(false, 3);
    goNext();
  };

  switch (currentStep) {
    case "welcome":
      return <WelcomeScreen onNext={goNext} />;
    case "name":
      return <NameScreen onNext={goNext} onBack={goBack} />;
    case "notifications":
      return (
        <NotificationsScreen
          onNext={goNext}
          onBack={goBack}
          onSkip={handleSkipNotifications}
        />
      );
    case "welcomeBack":
      return <WelcomeBackScreen onComplete={handleComplete} />;
  }
}
