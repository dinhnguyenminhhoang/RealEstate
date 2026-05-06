import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const SW = Dimensions.get("window").width;
const CW = (SW - 52) / 2;

interface Props {
  overall: any;
}

export default function OverviewCards({ overall }: Props) {
  const main = [
    {
      icon: "people-outline",
      label: "Người dùng",
      value: overall?.users?.total || 0,
      sub: `${overall?.users?.active || 0} hoạt động`,
      route: "/(admin)/users",
    },
    {
      icon: "document-text-outline",
      label: "Bài đăng",
      value: overall?.posts?.total || 0,
      sub: `${overall?.posts?.active || 0} đang hiển thị`,
      route: "/(admin)/posts",
    },
    {
      icon: "flag-outline",
      label: "Báo cáo",
      value: overall?.reports?.total || 0,
      sub: `${overall?.reports?.pending || 0} chờ xử lý`,
      route: "/(admin)/reports",
    },
    {
      icon: "newspaper-outline",
      label: "Tin tức",
      value: overall?.news?.total || 0,
      sub: `${overall?.news?.active || 0} hoạt động`,
      route: "/(admin)/news",
    },
  ];
  const mini = [
    {
      icon: "home-outline",
      label: "BĐS bán",
      value: overall?.posts?.sell || 0,
    },
    {
      icon: "key-outline",
      label: "BĐS thuê",
      value: overall?.posts?.rent || 0,
    },
    {
      icon: "folder-outline",
      label: "Danh mục",
      value: overall?.categories?.total || 0,
    },
    {
      icon: "time-outline",
      label: "Chờ duyệt",
      value: overall?.posts?.inactive || 0,
    },
  ];

  return (
    <>
      <View className="flex-row flex-wrap gap-3 mb-4">
        {main.map((c) => (
          <Pressable
            key={c.label}
            onPress={() => router.push(c.route as any)}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4"
            style={{ width: CW }}
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-3 bg-gray-50 border border-gray-100"
            >
              <Ionicons name={c.icon as any} size={22} color="#4B5563" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">{c.value}</Text>
            <Text className="text-gray-500 text-sm">{c.label}</Text>
            <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
              <View
                className="w-1.5 h-1.5 rounded-full mr-1.5 bg-gray-400"
              />
              <Text className="text-gray-500 text-xs">{c.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex-row flex-wrap gap-3 mb-6">
        {mini.map((c) => (
          <View
            key={c.label}
            className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex-row items-center"
            style={{ width: CW }}
          >
            <View className="bg-gray-50 p-2 rounded-lg border border-gray-100">
              <Ionicons name={c.icon as any} size={18} color="#4B5563" />
            </View>
            <View className="ml-2 flex-1">
              <Text className="text-lg font-bold text-gray-900">{c.value}</Text>
              <Text className="text-gray-500 text-xs">{c.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
