import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface TextInputProps extends RNTextInputProps {}

export function TextInput({ style, ...props }: TextInputProps) {
  const { theme } = useUnistyles();

  return (
    <RNTextInput
      placeholderTextColor={theme.colors.textSecondary}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
}));
