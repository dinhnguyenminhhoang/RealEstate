import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { forgotPasswordApi } from "@/services/authService";
import { useNotification } from "@/hooks/useNotification";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showSuccess, showError, handleError } = useNotification();

  const onSubmit = async () => {
    if (!email.trim()) return showError("Vui lòng nhập email");

    setLoading(true);
    try {
      const res: any = await forgotPasswordApi({ email: email.trim() });
      if (res.status === 200) {
        setSent(true);
        showSuccess("Đã gửi link đặt lại mật khẩu vào email của bạn");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">📧</Text>
        <Text className="text-xl font-bold text-gray-900 text-center">Kiểm tra email của bạn</Text>
        <Text className="text-gray-500 text-center mt-3 leading-6">
          Chúng tôi đã gửi link đặt lại mật khẩu đến{"\n"}
          <Text className="font-bold text-gray-900">{email}</Text>
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace("/(auth)/sign-in")}
          buttonColor="#DC2626"
          className="mt-8 w-full"
          contentStyle={{ paddingVertical: 4 }}
        >
          Quay lại Đăng nhập
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
          {/* Header */}
          <View className="items-center mt-16 mb-10">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🔒</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">Quên mật khẩu?</Text>
            <Text className="text-base text-gray-500 mt-2 text-center leading-6">
              Nhập email đã đăng ký, chúng tôi sẽ gửi{"\n"}link đặt lại mật khẩu cho bạn
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="email-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading || !email.trim()}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={{ paddingVertical: 6 }}
              labelStyle={{ fontSize: 16, fontWeight: "700" }}
              className="mt-2 rounded-lg"
            >
              Gửi link đặt lại
            </Button>
          </View>

          {/* Back */}
          <View className="flex-row justify-center mt-8">
            <Link href="/(auth)/sign-in" asChild>
              <Pressable className="flex-row items-center">
                <Text className="text-red-600 text-base font-medium">← Quay lại Đăng nhập</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
