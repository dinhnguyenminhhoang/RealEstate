import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Keyboard,
  TextInput as RNTextInput,
} from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthForm } from "@/hooks/useAuthForm";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

export default function ConfirmAccountScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { loading, handleVerifyOtp, handleResendOtp } = useAuthForm();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Only allow digits
      const digit = text.replace(/[^0-9]/g, "");

      if (digit.length > 1) {
        // Handle paste — distribute digits across inputs
        const digits = digit.split("").slice(0, OTP_LENGTH);
        const newOtp = [...otp];
        digits.forEach((d, i) => {
          if (index + i < OTP_LENGTH) {
            newOtp[index + i] = d;
          }
        });
        setOtp(newOtp);
        const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
        focusInput(nextIndex);
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-focus next input
      if (digit && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [otp, focusInput],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        focusInput(index - 1);
      }
    },
    [otp, focusInput],
  );

  const otpCode = otp.join("");
  const canSubmit = otpCode.length === OTP_LENGTH;

  const onSubmit = () => {
    Keyboard.dismiss();
    if (canSubmit && email) {
      handleVerifyOtp(email, otpCode);
    }
  };

  const onResend = () => {
    if (canResend && email) {
      handleResendOtp(email);
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
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
          <View style={styles.header}>
            <View style={styles.iconShadow}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>✉️</Text>
              </View>
            </View>

            <Text style={styles.title}>Xác thực tài khoản</Text>

            <Text style={styles.subtitle}>
              Chúng tôi đã gửi mã xác thực 6 số đến email
            </Text>

            <Text style={styles.emailText}>{email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nhập mã xác thực</Text>

            <View style={styles.otpContainer}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    otp[index] ? styles.otpInputFilled : null,
                  ]}
                  value={otp[index]}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                  caretHidden
                />
              ))}
            </View>

            <Text style={styles.helperText}>
              Mã xác thực có hiệu lực trong 10 phút.
            </Text>

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
              {loading ? "Đang xác thực..." : "Xác thực tài khoản"}
            </Button>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Không nhận được mã? </Text>

              {canResend ? (
                <Pressable onPress={onResend} hitSlop={10}>
                  <Text style={styles.resendLink}>Gửi lại mã</Text>
                </Pressable>
              ) : (
                <Text style={styles.resendCountdown}>
                  Gửi lại sau {countdown}s
                </Text>
              )}
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
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 28,
  },
  iconShadow: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 68,
    height: 68,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconText: {
    fontSize: 32,
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
  },
  emailText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
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
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  otpInputFilled: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  helperText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#6B7280",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "800",
    color: "#DC2626",
  },
  resendCountdown: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
});
