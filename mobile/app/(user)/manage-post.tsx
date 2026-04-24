import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Chip, FAB } from "react-native-paper";

import { userGetAllPostApi, userDeletePostApi } from "@/services/postService";
import { useNotification } from "@/hooks/useNotification";
import { Post } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";

export default function ManagePostScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, handleError } = useNotification();

  const fetchPosts = useCallback(async () => {
    try {
      const res: any = await userGetAllPostApi({ page: 1, limit: 50 });
      if (res?.status === 200) setPosts(res.data?.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Bạn muốn xóa bài đăng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await userDeletePostApi(id);
            showSuccess("Đã xóa bài đăng");
            setPosts((p) => p.filter((post) => post._id !== id));
          } catch (e) {
            handleError(e);
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={posts}
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
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">
              Chưa có bài đăng nào
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="font-bold text-gray-900" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-red-600 font-bold mt-1">
                  {formatMoneyVND(item.price)}
                </Text>
                <View className="flex-row items-center mt-1.5">
                  <Chip
                    mode="outlined"
                    compact
                    textStyle={{ fontSize: 11 }}
                    className="mr-2"
                  >
                    {item.type === "SELL" ? "Bán" : "Cho thuê"}
                  </Chip>
                  <Chip
                    mode="flat"
                    compact
                    textStyle={{
                      fontSize: 11,
                      color: item.verification ? "#16A34A" : "#D97706",
                    }}
                    style={{
                      backgroundColor: item.verification
                        ? "#F0FDF4"
                        : "#FFFBEB",
                    }}
                  >
                    {item.verification ? "Đã duyệt" : "Chờ duyệt"}
                  </Chip>
                </View>
                {item.createdAt && (
                  <Text className="text-gray-400 text-xs mt-1.5">
                    {formatTimeAgo(item.createdAt)}
                  </Text>
                )}
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() =>
                    router.push(`/(user)/edit-post/${item._id}` as any)
                  }
                  className="bg-blue-50 p-2 rounded-lg"
                >
                  <Ionicons name="create-outline" size={20} color="#2563EB" />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item._id)}
                  className="bg-red-50 p-2 rounded-lg"
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
      <FAB
        icon="plus"
        color="white"
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "#DC2626",
        }}
        onPress={() => router.push("/(user)/create-post")}
      />
    </View>
  );
}
