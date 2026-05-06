import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getAllNewsApi } from "@/services/newsService";
import { News } from "@/types";
import { getImageUrl } from "@/constants/config";
import { formatTimeAgo } from "@/utils";

export default function NewsListScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res: any = await getAllNewsApi({ page: 1, limit: 20 });
      if (res?.status === 200) setNews(res.data?.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">Tin tức Bất Động Sản</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(i) => i._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/news/${item._id}`)}
              className="flex-row bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-3"
            >
              {item.thumb ? (
                <Image
                  source={{ uri: getImageUrl(item.thumb) }}
                  style={{ width: 110, height: 85, borderRadius: 12 }}
                  contentFit="cover"
                />
              ) : (
                <View style={{ width: 110, height: 85, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="newspaper-outline" size={32} color="#9CA3AF" />
                </View>
              )}
              <View className="flex-1 ml-3 justify-between py-1">
                <Text className="font-bold text-gray-900 text-sm leading-5" numberOfLines={2}>
                  {item.title}
                </Text>
                <View>
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1">
                      {item.createdAt ? formatTimeAgo(item.createdAt) : "Gần đây"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
