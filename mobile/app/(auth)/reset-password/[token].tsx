import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";
import { resetPasswordApi } from "@/services/authService";
import { storage } from "@/utils/storage";
import { useNotification } from "@/hooks/useNotification";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { showSuccess, showError, handleError } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    if (!password || !confirmPassword) return showError("Vui lòng nhập đầy đủ");
    if (password.length < 6) return showError("Mật khẩu phải có ít nhất 6 ký tự");
    if (password !== confirmPassword) return showError("Mật khẩu xác nhận không khớp");

    setLoading(true);
    try {
      // Set token + userId so authentication middleware works
      if (token) {
        await storage.setToken(token);
        try {
          const decoded = jwtDecode<{ userId: string }>(token);
          if (decoded.userId) {
            await storage.setUserId(decoded.userId);
          }
        } catch (decodeErr) {
          console.log("Failed to decode token:", decodeErr);
        }
      }

      const res: any = await resetPasswordApi({ password });
      if (res.status === 200) {
        setSuccess(true);
        showSuccess("Đặt lại mật khẩu thành công!");
        // Clear temp token after reset
        await storage.clearAll();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">✅</Text>
        <Text className="text-xl font-bold text-green-600">Đặt lại mật khẩu thành công!</Text>
        <Text className="text-gray-500 text-center mt-3">
          Bạn có thể đăng nhập bằng mật khẩu mới.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace("/(auth)/sign-in")}
          buttonColor="#DC2626"
          className="mt-8 w-full"
          contentStyle={{ paddingVertical: 4 }}
        >
          Đăng nhập ngay
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="items-center mt-16 mb-10">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🔑</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</Text>
            <Text className="text-base text-gray-500 mt-2 text-center">
              Nhập mật khẩu mới cho tài khoản của bạn
            </Text>
          </View>

          <View className="gap-4">
            <TextInput
              label="Mật khẩu mới"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-check-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading || !password || !confirmPassword}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={{ paddingVertical: 6 }}
              labelStyle={{ fontSize: 16, fontWeight: "700" }}
              className="mt-2 rounded-lg"
            >
              Đặt lại mật khẩu
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
