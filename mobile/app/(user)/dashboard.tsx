import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/context/AuthContext";
import { getAuthorSummaryApi } from "@/services/summaryService";

interface StatCard {
  icon: string;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?._id) {
          const res: any = await getAuthorSummaryApi(user._id);
          if (res?.status === 200) setStats(res.data);
        }
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?._id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  const cards: StatCard[] = [
    {
      icon: "document-text",
      label: "Tổng bài đăng",
      value: stats?.stats?.totalPosts || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: "eye",
      label: "Tổng lượt xem",
      value: stats?.stats?.totalViews || 0,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: "heart",
      label: "Tổng yêu thích",
      value: stats?.stats?.totalFavorites || 0,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: "home",
      label: "Bài bán",
      value: stats?.stats?.sellPosts || 0,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: "key",
      label: "Bài cho thuê",
      value: stats?.stats?.rentPosts || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-4 pb-6">
        <Text className="text-gray-500 mb-4">
          Xin chào, {user?.userName} 👋
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {cards.map((card) => (
            <View
              key={card.label}
              className={`${card.bg} rounded-xl p-4 flex-1`}
              style={{ minWidth: "45%" }}
            >
              <Ionicons
                name={card.icon as any}
                size={24}
                color={
                  card.color.includes("blue")
                    ? "#2563EB"
                    : card.color.includes("green")
                      ? "#16A34A"
                      : card.color.includes("red")
                        ? "#DC2626"
                        : card.color.includes("orange")
                          ? "#EA580C"
                          : "#9333EA"
                }
              />
              <Text className="text-2xl font-bold text-gray-900 mt-2">
                {card.value}
              </Text>
              <Text className="text-gray-500 text-sm mt-0.5">{card.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
