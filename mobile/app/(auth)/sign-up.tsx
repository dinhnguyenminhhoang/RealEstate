import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNotification } from "@/hooks/useNotification";

export default function SignUpScreen() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    taxCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleSignUp } = useAuthForm();
  const { showError } = useNotification();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    if (
      !form.userName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.address
    ) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (form.password.length < 6) {
      showError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    const { confirmPassword, ...payload } = form;
    handleSignUp(payload);
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
          <View className="items-center mt-8 mb-8">
            <View className="w-16 h-16 bg-red-500 rounded-2xl items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">BĐS</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              Tạo tài khoản
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Đăng ký để bắt đầu giao dịch bất động sản
            </Text>
          </View>

          {/* Form */}
          <View className="gap-3">
            <TextInput
              label="Họ và tên *"
              value={form.userName}
              onChangeText={(v) => updateField("userName", v)}
              mode="outlined"
              left={<TextInput.Icon icon="account-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Email *"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Số điện thoại *"
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              mode="outlined"
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Địa chỉ *"
              value={form.address}
              onChangeText={(v) => updateField("address", v)}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Mã số thuế"
              value={form.taxCode}
              onChangeText={(v) => updateField("taxCode", v)}
              mode="outlined"
              left={<TextInput.Icon icon="file-document-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              className="bg-white"
            />

            <TextInput
              label="Mật khẩu *"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
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
              label="Xác nhận mật khẩu *"
              value={form.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
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
              disabled={loading}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={{ paddingVertical: 6 }}
              labelStyle={{ fontSize: 16, fontWeight: "700" }}
              className="mt-2 rounded-lg"
            >
              Đăng ký
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-gray-500 text-base">Đã có tài khoản? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text className="text-red-600 text-base font-bold">
                  Đăng nhập
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
