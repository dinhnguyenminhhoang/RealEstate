import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "react-native-paper";

import { getMyApplicationsApi } from "@/services/applicationService";
import { Application, Post } from "@/types";
import { formatTimeAgo } from "@/utils";

export default function MyApplicationsScreen() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApps = useCallback(async () => {
    try {
      const res: any = await getMyApplicationsApi({ page: 1, limit: 50 });
      if (res?.status === 200) setApps(res.data?.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchApps();
    setRefreshing(false);
  }, [fetchApps]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={apps}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DC2626"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="mail-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">
              Chưa có đơn ứng tuyển nào
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const postTitle =
            typeof item.post === "object"
              ? (item.post as Post).title
              : item.post;
          return (
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <Text className="font-bold text-gray-900" numberOfLines={1}>
                {postTitle}
              </Text>
              <View className="mt-2">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-1.5">
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="call-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-1.5">
                    {item.phone}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-1.5">
                    {item.email}
                  </Text>
                </View>
              </View>
              {item.content && (
                <Text
                  className="text-gray-500 text-sm mt-2 italic"
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
              )}
              {item.createdAt && (
                <Text className="text-gray-400 text-xs mt-2">
                  {formatTimeAgo(item.createdAt)}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
