import instance from "../config/instance";

const signinApi = (formData) => {
  return instance.post("/login", formData);
};
const signupApi = (formData) => {
  return instance.post("/register", formData);
};
const forgotPasswordApi = (formData) => {
  return instance.post("/forgot-password", formData);
};
const resetPasswordApi = (formData) => {
  return instance.post("/reset-password", formData);
};
const confirmAccountApi = () => {
  return instance.post("/confirm-account");
};
export {
  signinApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  confirmAccountApi,
};
