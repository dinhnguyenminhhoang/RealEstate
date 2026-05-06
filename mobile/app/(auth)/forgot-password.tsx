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
      <SafeAreaView style={styles.safeAreaCenter}>
        <Text style={styles.successIcon}>📧</Text>
        <Text style={styles.successTitle}>Kiểm tra email của bạn</Text>
        <Text style={styles.successSubtitle}>
          Chúng tôi đã gửi link đặt lại mật khẩu đến{"\n"}
          <Text style={styles.boldText}>{email}</Text>
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace("/(auth)/sign-in")}
          buttonColor="#DC2626"
          style={styles.backButton}
          contentStyle={styles.backButtonContent}
        >
          Quay lại Đăng nhập
        </Button>
      </SafeAreaView>
    );
  }

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
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🔒</Text>
            </View>
            <Text style={styles.title}>Quên mật khẩu?</Text>
            <Text style={styles.subtitle}>
              Nhập email đã đăng ký, chúng tôi sẽ gửi{"\n"}link đặt lại mật khẩu
              cho bạn
            </Text>
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

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={loading}
              disabled={loading || !email.trim()}
              buttonColor="#DC2626"
              textColor="white"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              Gửi link đặt lại
            </Button>
          </View>

          {/* Back */}
          <View style={styles.footerContainer}>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable style={styles.backLinkContainer}>
                <Text style={styles.backLinkText}>← Quay lại Đăng nhập</Text>
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
  safeAreaCenter: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  successSubtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
    color: "#111827",
  },
  backButton: {
    marginTop: 32,
    width: "100%",
  },
  backButtonContent: {
    paddingVertical: 4,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 64,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FEE2E2",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    gap: 16,
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
    marginTop: 32,
  },
  backLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backLinkText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "500",
  },
});
