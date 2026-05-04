import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, RefreshControl, ActivityIndicator, Alert, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import { getAllPostApi, confirmPostApi, unPublishPostApi, deletePostApi } from "@/services/postService";
import { useNotification } from "@/hooks/useNotification";
import { Post, PaginationMeta } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";

export default function AdminPostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, limit: 10, page: 1, totalPages: 1 });
  const { showSuccess, handleError } = useNotification();

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      const res: any = await getAllPostApi({ page, limit: 10 });
      if (res?.status === 200) {
        setPosts(res.data?.data || []);
        if (res.data?.meta) setMeta(res.data.meta);
      }
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); await fetchPosts(1); setRefreshing(false);
  }, [fetchPosts]);

  const handleConfirm = async (id: string) => {
    try { await confirmPostApi(id); showSuccess("Đã duyệt bài đăng"); fetchPosts(meta.page); }
    catch (e) { handleError(e); }
  };

  const handleUnPublish = async (id: string) => {
    try { await unPublishPostApi(id); showSuccess("Đã hủy duyệt"); fetchPosts(meta.page); }
    catch (e) { handleError(e); }
  };

  const handleDelete = (post: Post) => {
    Alert.alert("Xác nhận", `Xóa "${post.title}"?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => {
        try { await deletePostApi(post._id); showSuccess("Đã xóa"); fetchPosts(meta.page); }
        catch (e) { handleError(e); }
      }},
    ]);
  };

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase()))
    : posts;

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#DC2626" /></View>;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-3 pb-2">
        <Searchbar placeholder="Tìm theo tiêu đề, địa chỉ..." value={search} onChangeText={setSearch}
          className="bg-white" style={{ height: 44 }} inputStyle={{ fontSize: 14 }} />
        <Text className="text-gray-400 text-xs mt-2">Tổng: {meta.total} bài đăng</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#DC2626"]} />}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">Không có bài đăng</Text>
          </View>
        }
        renderItem={({ item }) => {
          const authorName = typeof item.author === "object" ? (item.author as any)?.userName : "";
          return (
            <Pressable onPress={() => router.push(`/property/${item._id}`)} className="bg-white rounded-xl p-4 mb-2.5 shadow-sm">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Text className="font-bold text-gray-900 text-base" numberOfLines={2}>{item.title}</Text>
                  {authorName ? <Text className="text-gray-400 text-xs mt-0.5">Bởi: {authorName}</Text> : null}
                </View>
                <Text className="text-red-600 font-bold">{formatMoneyVND(item.price)}</Text>
              </View>

              {item.address && (
                <View className="flex-row items-center mb-2">
                  <Ionicons name="location-outline" size={13} color="#9CA3AF" />
                  <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>{item.address}</Text>
                </View>
              )}

              <View className="flex-row items-center gap-1.5 mb-2">
                <View className={`px-2 py-0.5 rounded ${item.type === "SELL" ? "bg-green-50" : "bg-blue-50"}`}>
                  <Text className={`text-xs font-semibold ${item.type === "SELL" ? "text-green-600" : "text-blue-600"}`}>
                    {item.type === "SELL" ? "Bán" : "Cho thuê"}
                  </Text>
                </View>
                <View className={`px-2 py-0.5 rounded ${item.verification ? "bg-green-50" : "bg-yellow-50"}`}>
                  <Text className={`text-xs font-medium ${item.verification ? "text-green-600" : "text-yellow-600"}`}>
                    {item.verification ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
                  </Text>
                </View>
                <View className="flex-row items-center ml-auto gap-2">
                  <View className="flex-row items-center">
                    <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-0.5">{item.views || 0}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="heart-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-0.5">{item.favorites || 0}</Text>
                  </View>
                </View>
              </View>

              {item.createdAt && <Text className="text-gray-400 text-xs mb-2">{formatTimeAgo(item.createdAt)}</Text>}

              {/* Actions */}
              <View className="flex-row gap-2 pt-2 border-t border-gray-100">
                {!item.verification ? (
                  <Pressable onPress={() => handleConfirm(item._id)} className="bg-green-50 px-3 py-2 rounded-lg flex-row items-center flex-1 justify-center">
                    <Ionicons name="checkmark-circle-outline" size={16} color="#16A34A" />
                    <Text className="text-green-600 text-sm ml-1 font-medium">Duyệt</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => handleUnPublish(item._id)} className="bg-yellow-50 px-3 py-2 rounded-lg flex-row items-center flex-1 justify-center">
                    <Ionicons name="close-circle-outline" size={16} color="#D97706" />
                    <Text className="text-yellow-700 text-sm ml-1 font-medium">Hủy duyệt</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => handleDelete(item)} className="bg-red-50 px-3 py-2 rounded-lg flex-row items-center justify-center" style={{ minWidth: 70 }}>
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-sm ml-1 font-medium">Xóa</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={
          meta.totalPages > 1 ? (
            <View className="flex-row items-center justify-center gap-2 py-4">
              <Pressable onPress={() => meta.page > 1 && fetchPosts(meta.page - 1)} disabled={meta.page <= 1}
                className={`px-3 py-2 rounded-lg ${meta.page <= 1 ? "bg-gray-100" : "bg-white border border-gray-200"}`}>
                <Ionicons name="chevron-back" size={18} color={meta.page <= 1 ? "#D1D5DB" : "#374151"} />
              </Pressable>
              <Text className="text-gray-600 text-sm">Trang {meta.page}/{meta.totalPages}</Text>
              <Pressable onPress={() => meta.page < meta.totalPages && fetchPosts(meta.page + 1)} disabled={meta.page >= meta.totalPages}
                className={`px-3 py-2 rounded-lg ${meta.page >= meta.totalPages ? "bg-gray-100" : "bg-white border border-gray-200"}`}>
                <Ionicons name="chevron-forward" size={18} color={meta.page >= meta.totalPages ? "#D1D5DB" : "#374151"} />
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}
