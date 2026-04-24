import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "react-native-paper";

import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/constants/config";

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
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="person-circle-outline" size={100} color="#D1D5DB" />
        <Text className="text-2xl font-bold text-gray-900 mt-4">Tài khoản</Text>
        <Text className="text-gray-500 text-center mt-2">
          Đăng nhập để quản lý bài đăng và hồ sơ cá nhân
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push("/(auth)/sign-in")}
          buttonColor="#DC2626"
          className="mt-6 w-full"
          contentStyle={{ paddingVertical: 4 }}
        >
          Đăng nhập
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push("/(auth)/sign-up")}
          className="mt-3 w-full"
          contentStyle={{ paddingVertical: 4 }}
        >
          Đăng ký tài khoản mới
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
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

        {/* User Menu */}
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

        {/* Admin Menu */}
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

        {/* Logout */}
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
