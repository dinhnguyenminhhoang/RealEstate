import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signupApi } from "../services/authService";
import useNotification from "./useNotification";

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const openNotification = useNotification();
  const handleSignIn = async (values) => {
    setLoading(true);
    try {
      return await login(values.email, values.password);
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        description: error,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values) => {
    setLoading(true);
    try {
      const response = await signupApi({
        userName: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      if (response.status === 201) {
        openNotification({
          type: "success",
          message: "Thông báo",
          description: "Đăng kí thành công, Vui lòng kiểm tra email",
        });
        return true;
      } else {
        openNotification({
          type: "error",
          message: "Thông báo",
          description: "Đăng kí thất bại",
        });
        return false;
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignIn,
    handleSignUp,
  };
};

export default useAuthForm;
