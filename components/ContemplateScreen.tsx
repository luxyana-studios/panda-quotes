import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import { styles } from "@/app/index.styles";

interface ContemplateScreenProps {
  currentQuote: string;
  quoteOpacity: SharedValue<number>;
  authorOpacity: SharedValue<number>;
  moveOnButtonOpacity: SharedValue<number>;
  showMoveOnButton: boolean;
  onMoveOn: () => void;
}

export function ContemplateScreen({
  currentQuote,
  quoteOpacity,
  authorOpacity,
  moveOnButtonOpacity,
  showMoveOnButton,
  onMoveOn,
}: ContemplateScreenProps) {
  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const authorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: authorOpacity.value,
  }));

  const moveOnButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: moveOnButtonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/modi.jpeg")}
        style={styles.pandaImage}
        contentFit="contain"
      />

      <Text style={styles.closingMessage}>Carry this thought with you.</Text>

      <View style={styles.quoteContainer}>
        <Animated.Text style={[styles.quoteText, quoteAnimatedStyle]}>
          {currentQuote}
        </Animated.Text>
        <Animated.Text style={[styles.author, authorAnimatedStyle]}>
          — Red Panda Philosopher
        </Animated.Text>
      </View>

      <Animated.View style={moveOnButtonAnimatedStyle}>
        <Pressable
          style={styles.primaryButton}
          onPress={onMoveOn}
          disabled={!showMoveOnButton}
        >
          <Text style={styles.primaryButtonText}>I'm ready to move on now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
