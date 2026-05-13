import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Keyboard,
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

  const emailRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const addressRef = useRef<any>(null);
  const taxCodeRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  const { loading, handleSignUp } = useAuthForm();
  const { showError } = useNotification();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    form.userName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.address.trim().length > 0 &&
    form.password.length >= 6 &&
    form.confirmPassword.length >= 6;

  const onSubmit = () => {
    Keyboard.dismiss();

    const payload = {
      userName: form.userName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
      address: form.address.trim(),
      taxCode: form.taxCode.trim(),
    };

    if (
      !payload.userName ||
      !payload.email ||
      !payload.phone ||
      !payload.password ||
      !payload.address
    ) {
      return showError("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    if (form.password.length < 6) {
      return showError("Mật khẩu phải có ít nhất 6 ký tự");
    }

    if (form.password !== form.confirmPassword) {
      return showError("Mật khẩu xác nhận không khớp");
    }

    handleSignUp(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.logoShadow}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>BĐS</Text>
              </View>
            </View>

            <Text style={styles.title}>Tạo tài khoản</Text>

            <Text style={styles.subtitle}>
              Đăng ký để đăng tin, quản lý hồ sơ và theo dõi giao dịch bất động
              sản của bạn.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              <Text style={styles.requiredText}>* Bắt buộc</Text>
            </View>

            <TextInput
              label="Họ và tên *"
              value={form.userName}
              onChangeText={(value) => updateField("userName", value)}
              mode="outlined"
              left={<TextInput.Icon icon="account-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              autoCapitalize="words"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <TextInput
              ref={emailRef}
              label="Email *"
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              mode="outlined"
              keyboardType="email-address"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              left={<TextInput.Icon icon="email-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />

            <TextInput
              ref={phoneRef}
              label="Số điện thoại *"
              value={form.phone}
              onChangeText={(value) => updateField("phone", value)}
              mode="outlined"
              keyboardType="phone-pad"
              inputMode="tel"
              autoComplete="tel"
              textContentType="telephoneNumber"
              left={<TextInput.Icon icon="phone-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => addressRef.current?.focus()}
            />

            <TextInput
              ref={addressRef}
              label="Địa chỉ *"
              value={form.address}
              onChangeText={(value) => updateField("address", value)}
              mode="outlined"
              autoComplete="street-address"
              textContentType="fullStreetAddress"
              left={<TextInput.Icon icon="map-marker-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => taxCodeRef.current?.focus()}
            />

            <TextInput
              ref={taxCodeRef}
              label="Mã số thuế"
              value={form.taxCode}
              onChangeText={(value) => updateField("taxCode", value)}
              mode="outlined"
              keyboardType="number-pad"
              inputMode="numeric"
              left={<TextInput.Icon icon="file-document-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Bảo mật tài khoản</Text>

            <TextInput
              ref={passwordRef}
              label="Mật khẩu *"
              value={form.password}
              onChangeText={(value) => updateField("password", value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword((prev) => !prev)}
                  forceTextInputFocus={false}
                />
              }
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <Text style={styles.helperText}>Mật khẩu tối thiểu 6 ký tự.</Text>

            <TextInput
              ref={confirmPasswordRef}
              label="Xác nhận mật khẩu *"
              value={form.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              left={<TextInput.Icon icon="lock-check-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading || !canSubmit}
              buttonColor="#DC2626"
              textColor="#FFFFFF"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={[
                styles.button,
                (loading || !canSubmit) && styles.buttonDisabled,
              ]}
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </Button>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>

            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={10}>
                <Text style={styles.footerLink}> Đăng nhập ngay</Text>
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
    backgroundColor: "#F9FAFB",
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 24,
  },
  logoShadow: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoContainer: {
    width: 62,
    height: 62,
    backgroundColor: "#DC2626",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  requiredText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
    marginBottom: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 14,
  },
  helperText: {
    marginTop: -6,
    marginBottom: 10,
    fontSize: 12,
    color: "#6B7280",
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 3,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 8,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 15,
  },
  footerLink: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "800",
  },
});
