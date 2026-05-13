import instance from "./instance";
import { LoginPayload, SignUpPayload } from "@/types";

export const signinApi = (data: LoginPayload) => {
  return instance.post("/login", data);
};

export const signupApi = (data: SignUpPayload) => {
  return instance.post("/register", data);
};

export const forgotPasswordApi = (data: { email: string }) => {
  return instance.post("/forgot-password", data);
};

export const resetPasswordApi = (data: {
  email?: string;
  code?: string;
  password: string;
}) => {
  return instance.post("/reset-password", data);
};

export const verifyOtpApi = (data: { email: string; code: string }) => {
  return instance.post("/verify-otp", data);
};

export const resendOtpApi = (data: { email: string }) => {
  return instance.post("/resend-otp", data);
};
