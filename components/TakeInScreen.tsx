import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import { styles } from "@/app/index.styles";

interface TakeInScreenProps {
  currentQuote: string;
  quoteOpacity: SharedValue<number>;
  authorOpacity: SharedValue<number>;
  quoteButtonOpacity: SharedValue<number>;
  onSitWithThis: () => void;
  onDrawWisdom: () => void;
}

export function TakeInScreen({
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
