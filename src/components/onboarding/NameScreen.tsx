import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { onboardingStyles as styles } from "@/styles/onboarding.styles";

interface NameScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const EASE_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export function NameScreen({ onNext, onBack }: NameScreenProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reanimated shared values are stable refs
  useEffect(() => {
    const timer = setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
      contentTranslateY.value = withTiming(0, {
        duration: 700,
        easing: EASE_OUT,
      });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>{"\u2039"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t("onboarding.name.header")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Animated.View style={[styles.screenContent, contentStyle]}>
        <View style={styles.smallPandaWrapper}>
          <Image
            source={require("@/assets/modi.jpeg")}
            style={styles.smallPandaImage}
            contentFit="cover"
          />
        </View>

        <Text style={styles.heading}>{t("onboarding.name.heading")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.name.subtitle")}</Text>

        <View style={styles.textInputWrapper}>
          <Text style={styles.textInputLabel}>
            {t("onboarding.name.label")}
          </Text>
          <TextInput
            style={[styles.textInput, focused && styles.textInputFocused]}
            placeholder={t("onboarding.name.placeholder")}
            placeholderTextColor="#c4bbb0"
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </Animated.View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{t("onboarding.name.next")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
