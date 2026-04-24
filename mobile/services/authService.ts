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

export const resetPasswordApi = (data: { password: string }) => {
  return instance.post("/reset-password", data);
};

export const confirmAccountApi = () => {
  return instance.post("/confirm-account");
};
