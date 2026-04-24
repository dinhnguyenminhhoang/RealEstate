import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/context/AuthContext";
import "../global.css";

const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#DC2626",
    primaryContainer: "#FEE2E2",
    secondary: "#2563EB",
    secondaryContainer: "#DBEAFE",
    error: "#DC2626",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceVariant: "#F3F4F6",
  },
};

const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#F87171",
    primaryContainer: "#7F1D1D",
    secondary: "#60A5FA",
    secondaryContainer: "#1E3A8A",
    error: "#F87171",
    background: "#111827",
    surface: "#1F2937",
    surfaceVariant: "#374151",
  },
};

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(user)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen
              name="property/[id]"
              options={{
                headerShown: true,
                title: "Chi tiết bài đăng",
                headerBackTitle: "Quay lại",
              }}
            />
            <Stack.Screen
              name="news/[id]"
              options={{
                headerShown: true,
                title: "Chi tiết tin tức",
                headerBackTitle: "Quay lại",
              }}
            />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
