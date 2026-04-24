import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen
        name="manage-post"
        options={{ title: "Quản lý bài đăng" }}
      />
      <Stack.Screen name="create-post" options={{ title: "Đăng tin mới" }} />
      <Stack.Screen name="edit-post/[id]" options={{ title: "Sửa bài đăng" }} />
      <Stack.Screen
        name="my-applications"
        options={{ title: "Đơn ứng tuyển" }}
      />
    </Stack>
  );
}
