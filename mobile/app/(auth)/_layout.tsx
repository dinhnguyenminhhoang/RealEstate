import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: false, title: "Quên mật khẩu" }}
      />
      <Stack.Screen
        name="confirm-account"
        options={{ headerShown: false, title: "Xác thực tài khoản" }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ headerShown: false, title: "Đặt lại mật khẩu" }}
      />
      <Stack.Screen
        name="reset-password/[token]"
        options={{ headerShown: false, title: "Đặt lại mật khẩu" }}
      />
    </Stack>
  );
}
