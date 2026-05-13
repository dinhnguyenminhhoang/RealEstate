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
import { router, Stack } from "expo-router";
import { Image } from "expo-image";

import { userGetAllPostApi, userDeletePostApi } from "@/services/postService";
import { useNotification } from "@/hooks/useNotification";
import { Post } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";
import { getImageUrl } from "@/constants/config";

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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4 py-2">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </Pressable>
          ) 
        }} 
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DC2626"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-32">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 text-lg font-medium">
              Chưa có bài đăng nào
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Bấm vào nút dấu cộng góc dưới để tạo bài đăng đầu tiên của bạn.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const thumbnail = item.images && item.images.length > 0 ? getImageUrl(item.images[0].path) : null;
          
          return (
            <Pressable 
              onPress={() => router.push(`/(user)/edit-post/${item._id}` as any)}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex-row"
            >
              {/* Thumbnail */}
              <View className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mr-4">
                {thumbnail ? (
                  <Image source={{ uri: thumbnail }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className="flex-1 justify-between py-1">
                <View>
                  <Text className="font-bold text-gray-900 text-base leading-tight" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text className="text-red-600 font-bold mt-1 text-base">
                    {formatMoneyVND(item.price)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    {/* Type badge */}
                    <View className="border border-gray-200 px-2 py-0.5 rounded mr-2">
                      <Text className="text-[10px] text-gray-600 font-medium uppercase">
                        {item.type === "SELL" ? "Bán" : "Cho thuê"}
                      </Text>
                    </View>
                    
                    {/* Status badge */}
                    <View className={`px-2 py-0.5 rounded ${item.verification ? "bg-green-100" : "bg-amber-100"}`}>
                      <Text className={`text-[10px] font-bold ${item.verification ? "text-green-700" : "text-amber-700"}`}>
                        {item.verification ? "Đã duyệt" : "Chờ duyệt"}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Action Buttons */}
                  <View className="flex-row items-center gap-2">
                    <Pressable
                      onPress={(e) => {
                         e.stopPropagation();
                         handleDelete(item._id);
                      }}
                      className="p-1.5 bg-red-50 rounded-lg"
                    >
                      <Ionicons name="trash-outline" size={16} color="#DC2626" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      
      {/* Custom FAB */}
      <Pressable
        className="absolute right-5 bottom-6 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
        onPress={() => router.push("/(user)/create-post")}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
