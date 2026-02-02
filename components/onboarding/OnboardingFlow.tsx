import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { NameScreen } from './NameScreen';
import { CategoriesScreen } from './CategoriesScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { WelcomeBackScreen } from './WelcomeBackScreen';

type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'categories'
  | 'notifications'
  | 'welcomeBack';

const STEPS: OnboardingStep[] = [
  'welcome',
  'name',
  'categories',
  'notifications',
  'welcomeBack',
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];

  const goNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onNext={goNext} />;
    case 'name':
      return <NameScreen onNext={goNext} onBack={goBack} />;
    case 'categories':
      return (
        <CategoriesScreen onNext={goNext} onBack={goBack} onSkip={goNext} />
      );
    case 'notifications':
      return <NotificationsScreen onNext={goNext} onBack={goBack} />;
    case 'welcomeBack':
      return <WelcomeBackScreen onComplete={onComplete} />;
  }
}
