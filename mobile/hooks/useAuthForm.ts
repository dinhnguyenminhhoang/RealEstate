import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { signupApi, verifyOtpApi, resendOtpApi } from "@/services/authService";
import { useNotification } from "./useNotification";
import { SignUpPayload } from "@/types";

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError, handleError } = useNotification();

  const handleSignIn = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const role = await login(values.email, values.password);
      showSuccess("Đăng nhập thành công!");
      if (role === "ADMIN") {
        router.replace("/(admin)/dashboard");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      showError(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: SignUpPayload) => {
    setLoading(true);
    try {
      const res: any = await signupApi(values);
      if (res.status === 201) {
        showSuccess(
          "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.",
        );
        router.replace({
          pathname: "/(auth)/confirm-account",
          params: { email: values.email },
        });
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (email: string, code: string) => {
    setLoading(true);
    try {
      await verifyOtpApi({ email, code });
      showSuccess("Xác thực tài khoản thành công! Vui lòng đăng nhập.");
      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (email: string) => {
    setLoading(true);
    try {
      await resendOtpApi({ email });
      showSuccess("Đã gửi lại mã xác thực. Vui lòng kiểm tra email.");
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignIn,
    handleSignUp,
    handleVerifyOtp,
    handleResendOtp,
  };
};
