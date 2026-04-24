import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { router } from "expo-router";

import PostCard from "@/components/PostCard";
import { userGetAllFavoriteList } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { Post } from "@/types";

export default function FavoritesScreen() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const res: any = await userGetAllFavoriteList();
      if (res?.status === 200) {
        setPosts(res.data?.data || []);
      }
    } catch (error) {
      console.log("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  }, [fetchFavorites]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="heart-outline" size={80} color="#D1D5DB" />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          Danh sách yêu thích
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Đăng nhập để lưu và xem lại các bài đăng yêu thích
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push("/(auth)/sign-in")}
          buttonColor="#DC2626"
          className="mt-6"
          contentStyle={{ paddingVertical: 4 }}
        >
          Đăng nhập
        </Button>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-5 py-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Yêu thích</Text>
        <Text className="text-gray-500 text-sm mt-1">
          {posts.length} bài đăng đã lưu
        </Text>
      </View>

      {posts.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-400 text-lg mt-4">
            Chưa có bài đăng yêu thích
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-1">
            Nhấn biểu tượng ❤️ trên bài đăng để lưu vào đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard listing={item} />}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#DC2626"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
