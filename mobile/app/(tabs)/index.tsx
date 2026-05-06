import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import PostCard from "@/components/PostCard";
import { getAllPostApi, getPostOutstandingApi } from "@/services/postService";
import { getAllCategoryApi } from "@/services/categoryService";
import { getAllNewsApi } from "@/services/newsService";
import { Post, Category, News } from "@/types";
import { getImageUrl } from "@/constants/config";
import { formatTimeAgo } from "@/utils";

const { width } = Dimensions.get("window");

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
          getAllPostApi({ page: 1, limit: 10 }),
          getAllCategoryApi({ page: 1, limit: 10 }),
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
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: "#DC2626" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <View className="flex-1 bg-gray-50">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#DC2626"
              colors={["#DC2626"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-red-600 px-5 pt-3 pb-12 rounded-b-[40px]">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-red-100 text-sm font-medium mb-1">
                  Khám phá không gian mới
                </Text>
                <Text className="text-white text-2xl font-bold tracking-tight">
                  BĐS Online
                </Text>
              </View>
              <Pressable className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="white"
                />
                <View className="absolute top-2 right-2.5 w-2 h-2 bg-yellow-400 rounded-full border border-red-600" />
              </Pressable>
            </View>
          </View>

          <View className="px-5" style={{ marginTop: -26 }}>
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              className="bg-white rounded-2xl flex-row items-center px-4 py-3.5 shadow-md border border-gray-100"
              style={{ elevation: 5 }}
            >
              <Ionicons name="search" size={22} color="#9CA3AF" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-400 text-sm">
                  Tìm kiếm khu vực, loại nhà...
                </Text>
              </View>
              <View className="w-8 h-8 bg-red-50 rounded-full items-center justify-center ml-2">
                <Ionicons name="options" size={18} color="#DC2626" />
              </View>
            </Pressable>
          </View>
          {categories.length > 0 && (
            <View className="mt-6 mb-2">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              >
                {categories.map((cat, index) => {
                  const icons = [
                    "home-outline",
                    "business-outline",
                    "map-outline",
                    "key-outline",
                    "business-outline",
                    "construct-outline",
                  ] as const;
                  const iconName = icons[index % icons.length];
                  return (
                    <Pressable
                      key={cat._id}
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/search",
                          params: { category: cat._id },
                        })
                      }
                      className="items-center w-20"
                    >
                      <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100 mb-2">
                        <Ionicons name={iconName} size={24} color="#DC2626" />
                      </View>
                      <Text
                        className="text-xs text-gray-700 text-center font-medium"
                        numberOfLines={2}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Outstanding Posts */}
          {postOutstanding.length > 0 && (
            <View className="mt-6">
              <View className="flex-row items-end justify-between px-5 mb-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    BĐS Nổi Bật
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Được quan tâm nhiều nhất
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push("/(tabs)/search")}
                  className="flex-row items-center"
                >
                  <Text className="text-red-600 text-sm font-semibold mr-1">
                    Xem tất cả
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#DC2626" />
                </Pressable>
              </View>
              <FlatList
                data={postOutstanding}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                snapToInterval={width * 0.75 + 16}
                decelerationRate="fast"
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={{ width: width * 0.75 }}>
                    <PostCard listing={item} horizontal />
                  </View>
                )}
              />
            </View>
          )}

          {/* All Posts */}
          {allPost.length > 0 && (
            <View className="mt-8 px-5">
              <View className="flex-row items-end justify-between mb-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    Tin Đăng Mới Nhất
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Cập nhật liên tục 24/7
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push("/(tabs)/search")}
                  className="flex-row items-center"
                >
                  <Text className="text-red-600 text-sm font-semibold mr-1">
                    Tất cả
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#DC2626" />
                </Pressable>
              </View>
              <View className="gap-4">
                {allPost.map((post) => (
                  <PostCard key={post._id} listing={post} />
                ))}
              </View>
            </View>
          )}

          {/* News Feed */}
          {news.length > 0 && (
            <View className="mt-8 px-5 mb-6">
              <View className="flex-row items-end justify-between mb-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    Tin Tức & Thị Trường
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Thông tin dự án, quy hoạch
                  </Text>
                </View>
              </View>
              <View className="gap-3">
                {news.map((item) => (
                  <Pressable
                    key={item._id}
                    onPress={() => router.push(`/news/${item._id}`)}
                    className="flex-row bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                  >
                    {item.thumb ? (
                      <Image
                        source={{ uri: getImageUrl(item.thumb) }}
                        style={{ width: 110, height: 85, borderRadius: 12 }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 110,
                          height: 85,
                          borderRadius: 12,
                          backgroundColor: "#F3F4F6",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="newspaper-outline"
                          size={32}
                          color="#9CA3AF"
                        />
                      </View>
                    )}
                    <View className="flex-1 ml-3 justify-between py-1">
                      <Text
                        className="font-bold text-gray-900 text-sm leading-5"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <View>
                        {item.tags && item.tags.length > 0 && (
                          <View className="flex-row mb-1.5 flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <View
                                key={tag}
                                className="bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100"
                              >
                                <Text className="text-blue-700 text-[10px] font-medium">
                                  {tag}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                        <View className="flex-row items-center mt-1">
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color="#9CA3AF"
                          />
                          <Text className="text-gray-400 text-xs ml-1">
                            {item.createdAt
                              ? formatTimeAgo(item.createdAt)
                              : "Gần đây"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => router.push("/news")}
                className="mt-4 bg-red-50 border border-red-100 py-3 rounded-xl items-center"
              >
                <Text className="text-red-600 font-semibold">
                  Xem thêm tin tức
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
