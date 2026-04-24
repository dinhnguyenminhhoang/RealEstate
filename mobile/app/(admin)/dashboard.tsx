import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getAdminSummaryApi } from "@/services/summaryService";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getAdminSummaryApi();
        if (res?.status === 200) setData(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#F87171" />
      </View>
    );

  const cards = [
    {
      icon: "people",
      label: "Người dùng",
      value: data?.users?.total || 0,
      color: "#3B82F6",
      bg: "#1E3A5F",
    },
    {
      icon: "document-text",
      label: "Bài đăng",
      value: data?.posts?.total || 0,
      color: "#10B981",
      bg: "#1A3F2F",
    },
    {
      icon: "flag",
      label: "Báo cáo",
      value: data?.reports?.total || 0,
      color: "#F59E0B",
      bg: "#3F3520",
    },
    {
      icon: "newspaper",
      label: "Tin tức",
      value: data?.news?.total || 0,
      color: "#8B5CF6",
      bg: "#2D2452",
    },
    {
      icon: "folder",
      label: "Danh mục",
      value: data?.categories?.total || 0,
      color: "#EC4899",
      bg: "#3F1D38",
    },
    {
      icon: "checkmark-circle",
      label: "BĐ đã duyệt",
      value: data?.posts?.active || 0,
      color: "#10B981",
      bg: "#1A3F2F",
    },
    {
      icon: "time",
      label: "BĐ chờ duyệt",
      value: data?.posts?.inactive || 0,
      color: "#F59E0B",
      bg: "#3F3520",
    },
    {
      icon: "alert-circle",
      label: "BC chờ xử lý",
      value: data?.reports?.pending || 0,
      color: "#EF4444",
      bg: "#3F1D1D",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-4 pb-8">
        <Text className="text-white text-lg mb-4">Tổng quan hệ thống</Text>
        <View className="flex-row flex-wrap gap-3">
          {cards.map((card) => (
            <View
              key={card.label}
              className="rounded-xl p-4 flex-1"
              style={{ minWidth: "45%", backgroundColor: card.bg }}
            >
              <Ionicons name={card.icon as any} size={28} color={card.color} />
              <Text className="text-3xl font-bold text-white mt-2">
                {card.value}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">{card.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
