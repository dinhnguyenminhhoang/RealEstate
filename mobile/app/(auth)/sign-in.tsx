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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleSignIn } = useAuthForm();

  const isSubmitDisabled = loading || !email.trim() || !password.trim();

  const onSubmit = () => {
    if (isSubmitDisabled) return;
    handleSignIn({ email: email.trim(), password });
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
          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>BĐS</Text>
              </View>
              <Text style={styles.title}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                left={<TextInput.Icon icon="email-outline" />}
                outlineColor="#D1D5DB"
                activeOutlineColor="#DC2626"
                textColor="#111827"
                style={styles.input}
              />

              <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
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

              <Link href="/(auth)/forgot-password" asChild>
                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </Pressable>
              </Link>

              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                disabled={isSubmitDisabled}
                buttonColor="#DC2626"
                textColor="white"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
              >
                Đăng nhập
              </Button>
            </View>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Đăng ký ngay</Text>
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
    backgroundColor: "#fff",
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
  },
  formContainer: {
    gap: 14,
  },
  input: {
    backgroundColor: "#fff",
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: "#FCA5A5", // A lighter red for disabled state
    opacity: 0.8,
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
    marginTop: 32,
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
