import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import { styles } from "@/app/index.styles";

interface StartScreenProps {
  intentionText1Opacity: SharedValue<number>;
  intentionText2Opacity: SharedValue<number>;
  intentionButtonOpacity: SharedValue<number>;
  onReady: () => void;
}

export function StartScreen({
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
