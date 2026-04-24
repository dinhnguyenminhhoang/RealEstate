import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function AdminLayout() {
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role !== "ADMIN") {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, role]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="users" options={{ title: "Quản lý người dùng" }} />
      <Stack.Screen name="categories" options={{ title: "Quản lý danh mục" }} />
      <Stack.Screen name="posts" options={{ title: "Quản lý bài đăng" }} />
      <Stack.Screen name="news" options={{ title: "Quản lý tin tức" }} />
      <Stack.Screen name="reports" options={{ title: "Quản lý báo cáo" }} />
    </Stack>
  );
}
