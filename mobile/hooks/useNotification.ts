import { useCallback, useRef } from "react";
import Toast from "react-native-toast-message";

export const useNotification = () => {
  const showSuccess = useCallback((message: string) => {
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  }, []);

  const showError = useCallback((message: string) => {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: message,
      position: "top",
      visibilityTime: 4000,
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    Toast.show({
      type: "info",
      text1: "Thông báo",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  }, []);

  const handleError = useCallback(
    (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi, vui lòng thử lại";
      showError(message);
    },
    [showError],
  );

  return { showSuccess, showError, showInfo, handleError };
};
