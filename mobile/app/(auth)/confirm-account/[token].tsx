import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";
import { confirmAccountApi } from "@/services/authService";
import { storage } from "@/utils/storage";
import { useNotification } from "@/hooks/useNotification";

export default function ConfirmAccountScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { showSuccess, showError } = useNotification();
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const confirm = async () => {
      try {
        if (token) {
          await storage.setToken(token);
          // Decode token to get userId for x-client-id header (required by authentication middleware)
          try {
            const decoded = jwtDecode<{ userId: string }>(token);
            if (decoded.userId) {
              await storage.setUserId(decoded.userId);
            }
          } catch (decodeErr) {
            console.log("Failed to decode token:", decodeErr);
          }
        }
        await confirmAccountApi();
        setStatus("success");
        showSuccess("Xác thực tài khoản thành công!");
      } catch (error) {
        setStatus("error");
        showError("Xác thực thất bại hoặc link đã hết hạn");
      }
    };
    confirm();
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      {status === "loading" && (
        <View className="items-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="mt-4 text-gray-600">Đang xác thực tài khoản...</Text>
        </View>
      )}
      {status === "success" && (
        <View className="items-center">
          <Text className="text-6xl mb-4">✅</Text>
          <Text className="text-xl font-bold text-green-600">
            Xác thực thành công!
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Tài khoản đã được kích hoạt. Bạn có thể đăng nhập ngay.
          </Text>
        </View>
      )}
      {status === "error" && (
        <View className="items-center">
          <Text className="text-6xl mb-4">❌</Text>
          <Text className="text-xl font-bold text-red-600">
            Xác thực thất bại
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Link xác thực đã hết hạn hoặc không hợp lệ.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
