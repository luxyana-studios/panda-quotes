import { Text, type TextProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface TypographyProps extends TextProps {
  variant?: "title" | "heading" | "body" | "label" | "caption";
  color?: "text" | "textSecondary" | "primary" | "error";
}

export function Typography({
  variant = "body",
  color,
  style,
  ...props
}: TypographyProps) {
  const { theme } = useUnistyles();

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        color && { color: theme.colors[color] },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    color: theme.colors.text,
    fontFamily: theme.typography.fonts.sans,
  },
  title: {
    fontSize: theme.typography.sizes["3xl"],
    fontFamily: theme.typography.fonts.sansBold,
  },
  heading: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.sansSemibold,
  },
  body: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fonts.sans,
  },
  label: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fonts.sansSemibold,
  },
  caption: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.sans,
    color: theme.colors.textSecondary,
  },
}));
