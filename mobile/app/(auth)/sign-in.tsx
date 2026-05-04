import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleSignIn } = useAuthForm();

  const onSubmit = () => {
    if (!email.trim() || !password.trim()) return;
    handleSignIn({ email: email.trim(), password });
  };

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
          <View className="items-center mt-12 mb-10">
            <View className="w-20 h-20 bg-red-500 rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">BĐS</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">
              Chào mừng trở lại
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Đăng nhập để tiếp tục
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

            <TextInput
              label="Mật khẩu"
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

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable className="self-end">
                <Text className="text-red-600 text-sm font-medium">
                  Quên mật khẩu?
                </Text>
              </Pressable>
            </Link>

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading || !email.trim() || !password.trim()}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={{ paddingVertical: 6 }}
              labelStyle={{ fontSize: 16, fontWeight: "700" }}
              className="mt-2 rounded-lg"
            >
              Đăng nhập
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8 mb-6">
            <Text className="text-gray-500 text-base">Chưa có tài khoản? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text className="text-red-600 text-base font-bold">
                  Đăng ký ngay
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
