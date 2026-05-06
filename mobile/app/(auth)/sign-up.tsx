import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
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

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const onSubmit = () => {
    if (
      !form.userName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.address
    ) {
      return showError("Vui lòng điền đầy đủ thông tin bắt buộc");
    }
    if (form.password !== form.confirmPassword)
      return showError("Mật khẩu xác nhận không khớp");
    if (form.password.length < 6)
      return showError("Mật khẩu phải có ít nhất 6 ký tự");
    const { confirmPassword, ...payload } = form;
    handleSignUp(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BĐS</Text>
            </View>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>
              Đăng ký để bắt đầu giao dịch bất động sản
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              label="Họ và tên *"
              value={form.userName}
              onChangeText={(v) => updateField("userName", v)}
              mode="outlined"
              multiline={false}
              left={<TextInput.Icon icon="account-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Email *"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              multiline={false}
              left={<TextInput.Icon icon="email-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Số điện thoại *"
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              mode="outlined"
              keyboardType="phone-pad"
              multiline={false}
              left={<TextInput.Icon icon="phone-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Địa chỉ *"
              value={form.address}
              onChangeText={(v) => updateField("address", v)}
              mode="outlined"
              multiline={false}
              left={<TextInput.Icon icon="map-marker-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Mã số thuế"
              value={form.taxCode}
              onChangeText={(v) => updateField("taxCode", v)}
              mode="outlined"
              multiline={false}
              left={<TextInput.Icon icon="file-document-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Mật khẩu *"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              mode="outlined"
              multiline={false}
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
              textColor="#111827"
              style={styles.input}
            />
            <TextInput
              label="Xác nhận mật khẩu *"
              value={form.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
              mode="outlined"
              multiline={false}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-check-outline" />}
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              Đăng ký
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Đăng nhập</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 15,
  },
  footerLink: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "bold",
  },
});
