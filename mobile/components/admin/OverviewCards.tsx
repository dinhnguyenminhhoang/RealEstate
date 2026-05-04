import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const SW = Dimensions.get("window").width;
const CW = (SW - 52) / 2;

interface Props { overall: any }

export default function OverviewCards({ overall }: Props) {
  const main = [
    { icon: "people", label: "Người dùng", value: overall?.users?.total || 0, sub: `${overall?.users?.active || 0} hoạt động`, color: "#3B82F6", bg: "#172554", route: "/(admin)/users" },
    { icon: "document-text", label: "Bài đăng", value: overall?.posts?.total || 0, sub: `${overall?.posts?.active || 0} đang hiển thị`, color: "#10B981", bg: "#14532D", route: "/(admin)/posts" },
    { icon: "flag", label: "Báo cáo", value: overall?.reports?.total || 0, sub: `${overall?.reports?.pending || 0} chờ xử lý`, color: "#EF4444", bg: "#450A0A", route: "/(admin)/reports" },
    { icon: "newspaper", label: "Tin tức", value: overall?.news?.total || 0, sub: `${overall?.news?.active || 0} hoạt động`, color: "#8B5CF6", bg: "#2E1065", route: "/(admin)/news" },
  ];
  const mini = [
    { icon: "home", label: "BĐS bán", value: overall?.posts?.sell || 0, color: "#F59E0B", bg: "#451A03" },
    { icon: "key", label: "BĐS thuê", value: overall?.posts?.rent || 0, color: "#06B6D4", bg: "#083344" },
    { icon: "folder", label: "Danh mục", value: overall?.categories?.total || 0, color: "#EC4899", bg: "#500724" },
    { icon: "time", label: "Chờ duyệt", value: overall?.posts?.inactive || 0, color: "#F97316", bg: "#431407" },
  ];

  return (
    <>
      <View className="flex-row flex-wrap gap-3 mb-4">
        {main.map((c) => (
          <Pressable key={c.label} onPress={() => router.push(c.route as any)}
            className="rounded-2xl p-4" style={{ width: CW, backgroundColor: c.bg }}>
            <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: `${c.color}20` }}>
              <Ionicons name={c.icon as any} size={22} color={c.color} />
            </View>
            <Text className="text-3xl font-bold text-white">{c.value}</Text>
            <Text className="text-gray-400 text-sm">{c.label}</Text>
            <View className="flex-row items-center mt-2 pt-2 border-t border-gray-700">
              <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: c.color }} />
              <Text className="text-gray-500 text-xs">{c.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex-row flex-wrap gap-3 mb-6">
        {mini.map((c) => (
          <View key={c.label} className="rounded-xl p-3 flex-row items-center" style={{ width: CW, backgroundColor: c.bg }}>
            <Ionicons name={c.icon as any} size={18} color={c.color} />
            <View className="ml-2">
              <Text className="text-lg font-bold text-white">{c.value}</Text>
              <Text className="text-gray-400 text-xs">{c.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
