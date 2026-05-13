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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<any>(null);

  const { loading, handleSignIn } = useAuthForm();

  const isSubmitDisabled = loading || !email.trim() || !password.trim();

  const onSubmit = () => {
    if (isSubmitDisabled) return;

    Keyboard.dismiss();

    handleSignIn({
      email: email.trim().toLowerCase(),
      password,
    });
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
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <View style={styles.logoShadow}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>BĐS</Text>
                </View>
              </View>

              <Text style={styles.title}>Chào mừng trở lại</Text>

              <Text style={styles.subtitle}>
                Đăng nhập để quản lý bài đăng, hồ sơ và các giao dịch bất động
                sản của bạn.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Đăng nhập tài khoản</Text>
                <Text style={styles.cardHint}>Bảo mật</Text>
              </View>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
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
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <TextInput
                ref={passwordRef}
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
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
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <View style={styles.optionRow}>
                <Text style={styles.helperText}>
                  Nhập email và mật khẩu của bạn
                </Text>

                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable hitSlop={10}>
                    <Text style={styles.forgotPasswordText}>
                      Quên mật khẩu?
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                disabled={isSubmitDisabled}
                buttonColor="#DC2626"
                textColor="#FFFFFF"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                style={[
                  styles.button,
                  isSubmitDisabled && styles.buttonDisabled,
                ]}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </View>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Chưa có tài khoản?</Text>

              <Link href="/(auth)/sign-up" asChild>
                <Pressable hitSlop={10}>
                  <Text style={styles.footerLink}> Đăng ký ngay</Text>
                </Pressable>
              </Link>
            </View>
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
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoShadow: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logoContainer: {
    width: 68,
    height: 68,
    backgroundColor: "#DC2626",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 29,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 10,
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
  cardHint: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 14,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: -2,
    marginBottom: 12,
  },
  helperText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
  },
  forgotPasswordText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "800",
  },
  button: {
    marginTop: 2,
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
