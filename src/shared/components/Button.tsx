import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Typography } from "./Typography";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: "primary" | "outline";
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        typeof style === "function"
          ? style({ pressed } as Parameters<typeof style>[0])
          : style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            isPrimary ? styles.primaryText.color : styles.outlineText.color
          }
        />
      ) : (
        <Typography
          variant="label"
          style={isPrimary ? styles.primaryText : styles.outlineText}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "transparent",
  },
  primaryText: {
    color: theme.colors.primaryText,
  },
  outlineText: {
    color: theme.colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
}));
