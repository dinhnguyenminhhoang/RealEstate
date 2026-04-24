import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Chip, Searchbar } from "react-native-paper";

import {
  getAllPostApi,
  confirmPostApi,
  unPublishPostApi,
  deletePostApi,
} from "@/services/postService";
import { useNotification } from "@/hooks/useNotification";
import { Post } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";

export default function AdminPostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { showSuccess, handleError } = useNotification();

  const fetchPosts = useCallback(async () => {
    try {
      const res: any = await getAllPostApi({ page: 1, limit: 100 });
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

  const handleConfirm = async (id: string) => {
    try {
      await confirmPostApi(id);
      showSuccess("Đã duyệt");
      fetchPosts();
    } catch (e) {
      handleError(e);
    }
  };

  const handleUnPublish = async (id: string) => {
    try {
      await unPublishPostApi(id);
      showSuccess("Đã hủy duyệt");
      fetchPosts();
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Xóa bài đăng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePostApi(id);
            showSuccess("Đã xóa");
            fetchPosts();
          } catch (e) {
            handleError(e);
          }
        },
      },
    ]);
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-3 pb-2">
        <Searchbar
          placeholder="Tìm bài đăng..."
          value={search}
          onChangeText={setSearch}
          className="bg-white"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="font-bold text-gray-900" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-red-600 font-bold mt-1">
              {formatMoneyVND(item.price)}
            </Text>
            <View className="flex-row mt-2 gap-1">
              <Chip compact mode="flat" textStyle={{ fontSize: 10 }}>
                {item.type === "SELL" ? "Bán" : "Thuê"}
              </Chip>
              <Chip
                compact
                mode="flat"
                textStyle={{
                  fontSize: 10,
                  color: item.verification ? "#16A34A" : "#D97706",
                }}
                style={{
                  backgroundColor: item.verification ? "#F0FDF4" : "#FFFBEB",
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
            <View className="flex-row gap-2 mt-3">
              {!item.verification ? (
                <Pressable
                  onPress={() => handleConfirm(item._id)}
                  className="bg-green-50 px-3 py-1.5 rounded-lg flex-row items-center"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#16A34A"
                  />
                  <Text className="text-green-600 text-sm ml-1 font-medium">
                    Duyệt
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleUnPublish(item._id)}
                  className="bg-yellow-50 px-3 py-1.5 rounded-lg flex-row items-center"
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={16}
                    color="#D97706"
                  />
                  <Text className="text-yellow-700 text-sm ml-1 font-medium">
                    Hủy duyệt
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => handleDelete(item._id)}
                className="bg-red-50 px-3 py-1.5 rounded-lg flex-row items-center"
              >
                <Ionicons name="trash-outline" size={16} color="#DC2626" />
                <Text className="text-red-600 text-sm ml-1 font-medium">
                  Xóa
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
