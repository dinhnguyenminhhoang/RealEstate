import React, { useState } from "react";
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
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { forgotPasswordApi } from "@/services/authService";
import { useNotification } from "@/hooks/useNotification";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSuccess, handleError } = useNotification();

  const normalizedEmail = email.trim().toLowerCase();
  const isSubmitDisabled = loading || !normalizedEmail;

  const onSubmit = async () => {
    if (isSubmitDisabled) return;

    Keyboard.dismiss();

    setLoading(true);

    try {
      const res: any = await forgotPasswordApi({
        email: normalizedEmail,
      });

      if (res.status === 200) {
        showSuccess("Đã gửi mã đặt lại mật khẩu vào email của bạn");
        router.replace({
          pathname: "/(auth)/reset-password",
          params: { email: normalizedEmail },
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
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
                  <Text style={styles.logoText}>🔒</Text>
                </View>
              </View>

              <Text style={styles.title}>Quên mật khẩu?</Text>

              <Text style={styles.subtitle}>
                Nhập email đã đăng ký, chúng tôi sẽ gửi mã đặt lại mật khẩu
                cho bạn.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Khôi phục tài khoản</Text>
                <Text style={styles.cardHint}>Email</Text>
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
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />

              <Text style={styles.helperText}>
                Mã đặt lại mật khẩu sẽ được gửi đến email này nếu tài khoản
                tồn tại trong hệ thống.
              </Text>

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
                  styles.primaryButton,
                  isSubmitDisabled && styles.buttonDisabled,
                ]}
              >
                {loading ? "Đang gửi..." : "Gửi mã đặt lại"}
              </Button>
            </View>

            <View style={styles.footerContainer}>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable hitSlop={10} style={styles.backLinkContainer}>
                  <Text style={styles.backLinkText}>← Quay lại đăng nhập</Text>
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
    borderRadius: 22,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 30,
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
    marginBottom: 10,
  },
  inputOutline: {
    borderRadius: 14,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },
  primaryButton: {
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
    alignItems: "center",
    marginTop: 22,
    marginBottom: 8,
  },
  backLinkContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backLinkText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "800",
  },
  successWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
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
  successIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  successIconInner: {
    width: 74,
    height: 74,
    borderRadius: 26,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    fontSize: 34,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  successSubtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },
  emailBox: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  emailText: {
    color: "#991B1B",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
  successNote: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 22,
    lineHeight: 20,
    fontSize: 13,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
});
