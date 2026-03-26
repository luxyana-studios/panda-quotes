import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { AppProviders } from "@/core/providers/AppProviders";
import { useLoadFonts } from "@/core/theme/fonts";
import { WEB_MAX_WIDTH } from "@/core/theme/responsive";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded, fontError } = useLoadFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <AppProviders>
      <View style={styles.outerContainer}>
        <View style={styles.appContainer}>
          <Slot />
        </View>
      </View>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        backgroundColor: colors.brandDark,
        alignItems: "center" as const,
      },
    }),
  },
  appContainer: {
    flex: 1,
    width: "100%",
    ...Platform.select({
      web: {
        maxWidth: WEB_MAX_WIDTH,
        overflow: "hidden" as const,
      },
    }),
  },
});
