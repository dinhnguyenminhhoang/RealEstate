import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Button, TextInput } from "react-native-paper";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { forgotPasswordApi, resetPasswordApi } from "@/services/authService";
import { useNotification } from "@/hooks/useNotification";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

export default function ResetPasswordWithOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { showSuccess, showError, handleError } = useNotification();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  const normalizedEmail = String(email || "").trim().toLowerCase();

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
      const digit = text.replace(/[^0-9]/g, "");

      if (digit.length > 1) {
        const digits = digit.split("").slice(0, OTP_LENGTH);
        const newOtp = [...otp];
        digits.forEach((value, offset) => {
          if (index + offset < OTP_LENGTH) {
            newOtp[index + offset] = value;
          }
        });
        setOtp(newOtp);
        focusInput(Math.min(index + digits.length, OTP_LENGTH - 1));
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (digit && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [focusInput, otp],
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
    [focusInput, otp],
  );

  const otpCode = otp.join("");
  const canSubmit =
    Boolean(normalizedEmail) &&
    otpCode.length === OTP_LENGTH &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (!normalizedEmail) {
      showError("Thiếu email đặt lại mật khẩu");
      router.replace("/(auth)/forgot-password");
      return;
    }

    if (otpCode.length !== OTP_LENGTH) {
      showError("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    if (password.length < 6) {
      showError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res: any = await resetPasswordApi({
        email: normalizedEmail,
        code: otpCode,
        password,
      });

      if (res.status === 200) {
        showSuccess("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        router.replace("/(auth)/sign-in");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!canResend || !normalizedEmail) return;

    setResending(true);
    try {
      await forgotPasswordApi({ email: normalizedEmail });
      showSuccess("Đã gửi lại mã đặt mật khẩu. Vui lòng kiểm tra email.");
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (error) {
      handleError(error);
    } finally {
      setResending(false);
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
                <Text style={styles.iconText}>🔑</Text>
              </View>
            </View>

            <Text style={styles.title}>Đặt lại mật khẩu</Text>

            <Text style={styles.subtitle}>
              Nhập mã xác thực 6 số đã gửi đến email
            </Text>

            <Text style={styles.emailText}>{normalizedEmail}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mã xác thực</Text>

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
              Mã đặt lại mật khẩu có hiệu lực trong 10 phút.
            </Text>

            <TextInput
              label="Mật khẩu mới"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              }
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              autoComplete="new-password"
              textContentType="newPassword"
            />

            <TextInput
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-check-outline" />}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
              textColor="#111827"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              autoComplete="new-password"
              textContentType="newPassword"
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
                styles.primaryButton,
                (loading || !canSubmit) && styles.buttonDisabled,
              ]}
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </Button>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Không nhận được mã? </Text>

              {canResend ? (
                <Pressable onPress={onResend} disabled={resending} hitSlop={10}>
                  <Text style={styles.resendLink}>
                    {resending ? "Đang gửi..." : "Gửi lại mã"}
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.resendCountdown}>
                  Gửi lại sau {countdown}s
                </Text>
              )}
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable hitSlop={10} style={styles.backLinkContainer}>
                <Text style={styles.backLinkText}>← Nhập email khác</Text>
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
    textAlign: "center",
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
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  otpInputFilled: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 14,
  },
  primaryButton: {
    borderRadius: 16,
    marginTop: 4,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 8 },
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
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 18,
  },
  resendText: {
    color: "#6B7280",
    fontSize: 14,
  },
  resendLink: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "800",
  },
  resendCountdown: {
    color: "#991B1B",
    fontSize: 14,
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
});
