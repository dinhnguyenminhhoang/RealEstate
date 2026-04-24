import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "react-native-paper";

import PostCard from "@/components/PostCard";
import { getAllPostApi, getPostOutstandingApi } from "@/services/postService";
import { getAllCategoryApi } from "@/services/categoryService";
import { getAllNewsApi } from "@/services/newsService";
import { Post, Category, News } from "@/types";
import { getImageUrl } from "@/constants/config";
import { formatMoneyVND } from "@/utils";

export default function HomeScreen() {
  const [postOutstanding, setPostOutstanding] = useState<Post[]>([]);
  const [allPost, setAllPost] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [outstandingRes, allRes, catRes, newsRes]: any[] =
        await Promise.all([
          getPostOutstandingApi(8),
          getAllPostApi({ page: 1, limit: 6 }),
          getAllCategoryApi({ page: 1, limit: 20 }),
          getAllNewsApi({ page: 1, limit: 5 }),
        ]);

      if (outstandingRes?.status === 200)
        setPostOutstanding(outstandingRes.data);
      if (allRes?.status === 200) setAllPost(allRes.data?.data || []);
      if (catRes?.status === 200) setCategories(catRes.data?.data || []);
      if (newsRes?.status === 200) setNews(newsRes.data?.data || []);
    } catch (error) {
      console.log("Error fetching home data:", error);
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DC2626"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-red-600 px-5 pt-4 pb-8 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold">BĐS Online</Text>
          <Text className="text-red-100 text-sm mt-1">
            Tìm kiếm bất động sản dễ dàng
          </Text>
          {/* Search bar */}
          <Pressable
            onPress={() => router.push("/(tabs)/search")}
            className="bg-white rounded-xl flex-row items-center px-4 py-3 mt-4"
          >
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <Text className="text-gray-400 ml-3 flex-1">
              Tìm kiếm bất động sản...
            </Text>
            <Ionicons name="options-outline" size={20} color="#DC2626" />
          </Pressable>
        </View>

        {/* Quick Categories */}
        {categories.length > 0 && (
          <View className="mt-4 px-5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <Chip
                  key={cat._id}
                  mode="outlined"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/search",
                      params: { category: cat._id },
                    })
                  }
                  className="mr-2"
                  textStyle={{ fontSize: 13 }}
                >
                  {cat.name}
                </Chip>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Outstanding Posts */}
        {postOutstanding.length > 0 && (
          <View className="mt-6">
            <View className="flex-row items-center justify-between px-5 mb-3">
              <Text className="text-lg font-bold text-gray-900">
                BĐS nổi bật
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/search")}>
                <Text className="text-red-600 text-sm font-medium">
                  Xem tất cả
                </Text>
              </Pressable>
            </View>
            <FlatList
              data={postOutstanding}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <PostCard listing={item} horizontal />}
            />
          </View>
        )}

        {/* All Posts */}
        {allPost.length > 0 && (
          <View className="mt-6 px-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">
                Danh sách BĐS
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/search")}>
                <Text className="text-red-600 text-sm font-medium">
                  Xem tất cả
                </Text>
              </Pressable>
            </View>
            {allPost.map((post) => (
              <PostCard key={post._id} listing={post} />
            ))}
          </View>
        )}

        {/* News */}
        {news.length > 0 && (
          <View className="mt-6 px-5 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Tin tức BĐS
            </Text>
            {news.map((item) => (
              <Pressable
                key={item._id}
                onPress={() => router.push(`/news/${item._id}`)}
                className="flex-row bg-white rounded-xl p-3 mb-3 shadow-sm"
              >
                {item.thumb && (
                  <Image
                    source={{ uri: getImageUrl(item.thumb) }}
                    style={{ width: 100, height: 70, borderRadius: 8 }}
                    contentFit="cover"
                  />
                )}
                <View className="flex-1 ml-3 justify-center">
                  <Text
                    className="font-semibold text-gray-900 text-sm"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {item.tags && item.tags.length > 0 && (
                    <View className="flex-row mt-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <View
                          key={tag}
                          className="bg-blue-50 px-2 py-0.5 rounded mr-1"
                        >
                          <Text className="text-blue-600 text-xs">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
