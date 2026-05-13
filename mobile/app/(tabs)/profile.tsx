import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { getImageUrl } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  color?: string;
}

const userMenuItems: MenuItem[] = [
  {
    icon: "stats-chart-outline",
    label: "Dashboard",
    route: "/(user)/dashboard",
  },
  {
    icon: "document-text-outline",
    label: "Quản lý bài đăng",
    route: "/(user)/manage-post",
  },
  {
    icon: "add-circle-outline",
    label: "Đăng tin mới",
    route: "/(user)/create-post",
  },
  {
    icon: "mail-outline",
    label: "Đơn ứng tuyển",
    route: "/(user)/my-applications",
  },
];

const adminMenuItems: MenuItem[] = [
  {
    icon: "grid-outline",
    label: "Admin Dashboard",
    route: "/(admin)/dashboard",
  },
  {
    icon: "people-outline",
    label: "Quản lý người dùng",
    route: "/(admin)/users",
  },
  {
    icon: "folder-outline",
    label: "Quản lý danh mục",
    route: "/(admin)/categories",
  },
  {
    icon: "newspaper-outline",
    label: "Quản lý tin tức",
    route: "/(admin)/news",
  },
  {
    icon: "document-text-outline",
    label: "Quản lý bài đăng",
    route: "/(admin)/posts",
  },
  { icon: "flag-outline", label: "Quản lý báo cáo", route: "/(admin)/reports" },
];

export default function ProfileScreen() {
  const { user, role, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 px-5">
        <View className="flex-1 justify-center">
          <View className="bg-white rounded-3xl px-6 py-8 shadow-sm border border-gray-100">
            <View className="items-center">
              <View className="w-28 h-28 rounded-full bg-red-50 items-center justify-center mb-5">
                <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center">
                  <Ionicons
                    name="person-circle-outline"
                    size={58}
                    color="#DC2626"
                  />
                </View>
              </View>

              <Text className="text-3xl font-extrabold text-gray-900">
                Tài khoản
              </Text>

              <Text className="text-gray-500 text-center mt-3 leading-6">
                Đăng nhập để quản lý bài đăng, theo dõi đơn ứng tuyển và cập
                nhật hồ sơ cá nhân của bạn.
              </Text>
            </View>

            <View className="mt-8 gap-3">
              <Button
                mode="contained"
                onPress={() => router.push("/(auth)/sign-in")}
                buttonColor="#DC2626"
                textColor="#FFFFFF"
                className="rounded-2xl"
                contentStyle={{ paddingVertical: 8 }}
                labelStyle={{ fontSize: 16, fontWeight: "700" }}
                icon="login"
              >
                Đăng nhập
              </Button>

              <Button
                mode="outlined"
                onPress={() => router.push("/(auth)/sign-up")}
                textColor="#DC2626"
                className="rounded-2xl border-red-600"
                contentStyle={{ paddingVertical: 8 }}
                labelStyle={{ fontSize: 16, fontWeight: "700" }}
                icon="account-plus-outline"
              >
                Tạo tài khoản mới
              </Button>
            </View>

            <View className="mt-7 pt-5 border-t border-gray-100">
              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#DC2626"
                  />
                </View>
                <Text className="ml-3 text-gray-700 flex-1">
                  Quản lý bài đăng tuyển dụng
                </Text>
              </View>

              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
                  <Ionicons name="mail-outline" size={18} color="#DC2626" />
                </View>
                <Text className="ml-3 text-gray-700 flex-1">
                  Theo dõi đơn ứng tuyển
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
                  <Ionicons name="person-outline" size={18} color="#DC2626" />
                </View>
                <Text className="ml-3 text-gray-700 flex-1">
                  Cập nhật thông tin cá nhân
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white px-5 py-6">
          <Pressable
            onPress={() => router.push("/(user)/edit-profile" as any)}
            className="flex-row items-center"
          >
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <Image
                  source={{ uri: getImageUrl(user.avatar) }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                />
              ) : (
                <Text className="text-red-600 text-2xl font-bold">
                  {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {user?.userName}
              </Text>
              <Text className="text-gray-500 text-sm">{user?.email}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                {user?.phone}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
          {role === "ADMIN" && (
            <View className="bg-red-50 rounded-lg px-3 py-1.5 mt-3 self-start">
              <Text className="text-red-600 text-xs font-bold">👑 Admin</Text>
            </View>
          )}
        </View>

        <View className="bg-white mt-3 px-5">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">
            Quản lý
          </Text>
          {userMenuItems.map((item, index) => (
            <React.Fragment key={item.route}>
              <Pressable
                onPress={() => router.push(item.route as any)}
                className="flex-row items-center py-3.5"
              >
                <Ionicons name={item.icon as any} size={22} color="#4B5563" />
                <Text className="flex-1 ml-3 text-base text-gray-800">
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </Pressable>
              {index < userMenuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </View>

        {role === "ADMIN" && (
          <View className="bg-white mt-3 px-5">
            <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">
              Quản trị
            </Text>
            {adminMenuItems.map((item, index) => (
              <React.Fragment key={item.route}>
                <Pressable
                  onPress={() => router.push(item.route as any)}
                  className="flex-row items-center py-3.5"
                >
                  <Ionicons name={item.icon as any} size={22} color="#DC2626" />
                  <Text className="flex-1 ml-3 text-base text-gray-800">
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </Pressable>
                {index < adminMenuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </View>
        )}

        <View className="bg-white mt-3 px-5 mb-6">
          <Pressable onPress={logout} className="flex-row items-center py-4">
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="ml-3 text-base text-red-500 font-medium">
              Đăng xuất
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
