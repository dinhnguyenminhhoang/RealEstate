import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
  StatusBar,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button as PaperButton, Divider } from "react-native-paper";
import { router } from "expo-router";
import { Image } from "expo-image";
import RenderHtml from "react-native-render-html";
import {
  getAllPostByAdminApi,
  confirmPostApi,
  deletePostApi,
} from "@/services/postService";
import { useNotification } from "@/hooks/useNotification";
import { Post, PaginationMeta } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";
import { getImageUrl } from "@/constants/config";

export default function AdminPostsScreen() {
  const { width } = useWindowDimensions();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "verified" | "unverified">("all");
  
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
  });
  const { showSuccess, showError, handleError } = useNotification();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailPost, setDetailPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      const res: any = await getAllPostByAdminApi({ page, limit: 10 });
      if (res?.status === 200) {
        setPosts(res.data?.data || []);
        if (res.data?.meta) setMeta(res.data.meta);
      }
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
    await fetchPosts(1);
    setRefreshing(false);
  }, [fetchPosts]);

  const handleConfirmPost = async (post: Post) => {
    try {
      const res: any = await confirmPostApi(post._id);
      if (res?.status === 200) {
        showSuccess("Cập nhật trạng thái bài đăng thành công");
        setDetailVisible(false);
        fetchPosts(meta.page);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = (post: Post) => {
    Alert.alert(
      "Bạn có chắc chắn?",
      `Bạn thực sự muốn xóa bài đăng "${post.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePostApi(post._id);
              showSuccess("Xóa bài đăng thành công");
              setDetailVisible(false); // in case we delete from detail view
              fetchPosts(meta.page);
            } catch (e) {
              handleError(e);
            }
          },
        },
      ],
    );
  };

  const handleViewDetail = (post: Post) => {
    setDetailPost(post);
    setDetailVisible(true);
  };

  const filtered = posts.filter((p) => {
    // text search
    const matchesSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.address?.toLowerCase().includes(search.toLowerCase())
      : true;

    // filter status
    let matchesStatus = true;
    if (filterType === "verified") matchesStatus = p.verification === true;
    if (filterType === "unverified") matchesStatus = p.verification === false;

    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2 bg-gray-50 z-10">
        <View className="flex-row items-center mb-4 mt-2">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
          </Pressable>
          <View>
            <Text className="text-gray-900 text-xl font-bold">Bài đăng</Text>
            <Text className="text-gray-500 text-sm">Quản lý nội dung đăng</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mb-3">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              className="flex-1 ml-2 text-gray-900 text-sm h-full"
              placeholder="Tìm theo tiêu đề, địa chỉ..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} className="p-1">
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <View className="flex-row gap-2 mb-1">
          {([
            { id: "all", label: "Tất cả" },
            { id: "unverified", label: "Chờ duyệt" },
            { id: "verified", label: "Đã duyệt" },
          ] as const).map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-full border ${
                filterType === tab.id
                  ? "bg-gray-900 border-gray-900"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  filterType === tab.id ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-gray-400 text-xs mt-2">
          Hiển thị: {filtered.length} / Tổng: {meta.total}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
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
              Không có bài đăng phù hợp
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const authorName =
            typeof item.author === "object"
              ? (item.author as any)?.userName
              : "";
          return (
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-start gap-3 border border-gray-100">
              {/* Thumbnail */}
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: getImageUrl(item.images[0].path) }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                  className="bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                </View>
              )}

              {/* Info */}
              <View className="flex-1">
                <Text
                  className="font-bold text-gray-900 text-base"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-red-600 font-bold">
                    {formatMoneyVND(item.price)}
                  </Text>
                  <View
                    className={`px-1.5 py-0.5 rounded ${item.status === "in-stock" ? "bg-green-50" : "bg-red-50"}`}
                  >
                    <Text
                      className={`text-[10px] font-semibold ${item.status === "in-stock" ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
                    </Text>
                  </View>
                </View>

                {item.address && (
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#9CA3AF"
                    />
                    <Text
                      className="text-gray-500 text-xs ml-1 flex-1"
                      numberOfLines={1}
                    >
                      {item.address}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className={`px-1.5 py-0.5 rounded ${item.verification ? "bg-blue-50" : "bg-yellow-50"}`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${item.verification ? "text-blue-600" : "text-yellow-600"}`}
                      >
                        {item.verification ? "Đã duyệt" : "Chờ duyệt"}
                      </Text>
                    </View>
                    {authorName ? (
                      <View className="flex-row items-center ml-1">
                        <Ionicons name="person-outline" size={12} color="#9CA3AF" />
                        <Text className="text-gray-500 text-[10px] ml-0.5" numberOfLines={1} style={{ maxWidth: 80 }}>
                          {authorName}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  {item.createdAt && (
                    <Text className="text-gray-400 text-[10px]">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </Text>
                  )}
                </View>

                {/* Actions */}
                <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Pressable
                    onPress={() => handleViewDetail(item)}
                    className="bg-gray-900 px-3 py-1.5 rounded-lg flex-row items-center justify-center flex-1"
                  >
                    <Ionicons name="list" size={14} color="white" />
                    <Text className="text-white text-xs font-semibold ml-1">
                      Chi tiết & Duyệt
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex-row items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={14} color="#DC2626" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          meta.totalPages > 1 ? (
            <View className="flex-row items-center justify-center gap-2 py-4">
              <Pressable
                onPress={() => meta.page > 1 && fetchPosts(meta.page - 1)}
                disabled={meta.page <= 1}
                className={`px-3 py-2 rounded-lg ${meta.page <= 1 ? "bg-gray-100" : "bg-white border border-gray-200"}`}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={meta.page <= 1 ? "#D1D5DB" : "#374151"}
                />
              </Pressable>
              <Text className="text-gray-600 text-sm font-medium">
                Trang {meta.page}/{meta.totalPages}
              </Text>
              <Pressable
                onPress={() =>
                  meta.page < meta.totalPages && fetchPosts(meta.page + 1)
                }
                disabled={meta.page >= meta.totalPages}
                className={`px-3 py-2 rounded-lg ${meta.page >= meta.totalPages ? "bg-gray-100" : "bg-white border border-gray-200"}`}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={meta.page >= meta.totalPages ? "#D1D5DB" : "#374151"}
                />
              </Pressable>
            </View>
          ) : null
        }
      />

      {/* Detail Modal */}
      <Modal
        visible={detailVisible}
        animationType="slide"
        onRequestClose={() => setDetailVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
            <Text className="text-lg font-bold text-gray-900">Chi tiết bài đăng</Text>
            <Pressable onPress={() => setDetailVisible(false)} className="p-1.5 bg-gray-100 rounded-full">
              <Ionicons name="close" size={20} color="#4B5563" />
            </Pressable>
          </View>

          {detailPost && (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="p-4">
                
                {/* Header Actions - Move verify here */}
                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-row items-center justify-between mb-4">
                   <View className="flex-row items-center gap-3">
                     <View className={`w-11 h-11 rounded-full items-center justify-center ${detailPost.verification ? "bg-blue-100" : "bg-yellow-100"}`}>
                        <Ionicons name={detailPost.verification ? "shield-checkmark" : "time"} size={24} color={detailPost.verification ? "#1D4ED8" : "#A16207"} />
                     </View>
                     <View>
                        <Text className="text-xs text-gray-500 mb-0.5">Trạng thái duyệt</Text>
                        <Text className={`text-base font-bold ${detailPost.verification ? "text-blue-700" : "text-yellow-700"}`}>{detailPost.verification ? "Đã xác minh" : "Chờ duyệt"}</Text>
                     </View>
                   </View>
                   <PaperButton
                      mode="contained"
                      buttonColor={detailPost.verification ? "#DC2626" : "#16A34A"}
                      onPress={() => handleConfirmPost(detailPost)}
                      className="rounded-lg"
                      contentStyle={{ height: 40 }}
                      labelStyle={{ fontSize: 13, fontWeight: "bold", paddingHorizontal: 4 }}
                   >
                     {detailPost.verification ? "Hủy duyệt" : "Duyệt ngay"}
                   </PaperButton>
                </View>

                {/* Title & Status */}
                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                  <Text className="text-lg font-bold text-gray-900 mb-3">
                    {detailPost.title}
                  </Text>
                  <View className="flex-row items-center gap-2 mb-3">
                    <View
                      className={`px-2 py-1 rounded ${detailPost.status === "in-stock" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${detailPost.status === "in-stock" ? "text-green-700" : "text-red-700"}`}
                      >
                        {detailPost.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded ${detailPost.type === "SELL" ? "bg-purple-100" : "bg-orange-100"}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${detailPost.type === "SELL" ? "text-purple-700" : "text-orange-700"}`}
                      >
                        {detailPost.type === "SELL" ? "Bán" : "Cho thuê"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                    <Text className="text-gray-500 font-medium">Mức giá:</Text>
                    <Text className="text-red-600 font-bold text-xl">
                      {formatMoneyVND(detailPost.price)}
                    </Text>
                  </View>
                </View>

                {/* Post Info Box */}
                <View className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4">
                  <View className="bg-gray-50 px-3 py-2.5 border-b border-gray-200 flex-row items-center">
                    <Ionicons name="information-circle-outline" size={18} color="#4B5563" />
                    <Text className="font-bold text-gray-900 ml-1.5">Thông số kỹ thuật</Text>
                  </View>
                  <View className="p-3 bg-white space-y-3">
                    <View className="flex-row items-center">
                      <Text className="w-[35%] text-gray-500 text-sm font-medium">ID:</Text>
                      <Text className="flex-1 text-gray-900 text-sm font-mono">{detailPost._id}</Text>
                    </View>
                    <Divider />
                    <View className="flex-row">
                      <Text className="w-[35%] text-gray-500 text-sm font-medium pt-0.5">Địa chỉ:</Text>
                      <Text className="flex-1 text-gray-900 text-sm">{detailPost.address}</Text>
                    </View>
                    <Divider />
                    <View className="flex-row items-center">
                      <Text className="w-[35%] text-gray-500 text-sm font-medium">Ngày tạo:</Text>
                      <Text className="flex-1 text-gray-900 text-sm">
                        {detailPost.createdAt ? new Date(detailPost.createdAt).toLocaleDateString("vi-VN") : ""}
                      </Text>
                    </View>
                    <Divider />
                    <View className="flex-row items-center">
                      <Text className="w-[35%] text-gray-500 text-sm font-medium">Lượt xem:</Text>
                      <Text className="flex-1 text-gray-900 text-sm">{detailPost.views || 0}</Text>
                    </View>
                    <Divider />
                    <View className="flex-row items-center">
                      <Text className="w-[35%] text-gray-500 text-sm font-medium">Yêu thích:</Text>
                      <Text className="flex-1 text-gray-900 text-sm">{detailPost.favorites || 0}</Text>
                    </View>
                  </View>
                </View>

                {/* Author Info */}
                <View className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4">
                  <View className="bg-gray-50 px-3 py-2.5 border-b border-gray-200 flex-row items-center">
                    <Ionicons name="person-circle-outline" size={18} color="#4B5563" />
                    <Text className="font-bold text-gray-900 ml-1.5">Người đăng</Text>
                  </View>
                  <View className="p-3 bg-white">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3 border border-gray-200">
                        <Ionicons name="person" size={20} color="#9CA3AF" />
                      </View>
                      <View>
                        <Text className="font-bold text-gray-900 text-base">
                          {typeof detailPost.author === "object" ? (detailPost.author as any)?.userName : ""}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {typeof detailPost.author === "object" ? (detailPost.author as any)?.email : ""}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="call-outline" size={14} color="#6B7280" />
                      <Text className="text-gray-700 text-sm ml-2">
                        {typeof detailPost.author === "object" ? (detailPost.author as any)?.phone : ""}
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
                      <Text className="text-gray-700 text-sm ml-2 flex-1">
                        {typeof detailPost.author === "object" ? (detailPost.author as any)?.address : ""}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Images */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="images-outline" size={18} color="#4B5563" />
                    <Text className="text-base font-bold text-gray-900 ml-1.5">Hình ảnh đính kèm</Text>
                  </View>
                  {detailPost.images && detailPost.images.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                      {detailPost.images.map((img: any, i: number) => (
                        <Image
                          key={i}
                          source={{ uri: getImageUrl(img.path) }}
                          style={{ width: width * 0.4, height: width * 0.4, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' }}
                          contentFit="cover"
                        />
                      ))}
                    </ScrollView>
                  ) : (
                    <Text className="text-gray-500 italic text-sm">Không có hình ảnh</Text>
                  )}
                </View>

                {/* Description */}
                <View className="mb-4 bg-white p-3.5 border border-gray-200 rounded-xl shadow-sm">
                  <View className="flex-row items-center mb-2 pb-2 border-b border-gray-100">
                    <Ionicons name="document-text-outline" size={18} color="#4B5563" />
                    <Text className="text-base font-bold text-gray-900 ml-1.5">Mô tả chi tiết</Text>
                  </View>
                  {detailPost.description ? (
                    <RenderHtml
                      contentWidth={width - 32}
                      source={{ html: detailPost.description }}
                      baseStyle={{ color: "#374151", fontSize: 14, lineHeight: 22 }}
                    />
                  ) : (
                    <Text className="text-gray-500 italic text-sm">Không có nội dung</Text>
                  )}
                </View>

                {/* Overview */}
                <View className="mb-8 bg-white p-3.5 border border-gray-200 rounded-xl shadow-sm">
                  <View className="flex-row items-center mb-2 pb-2 border-b border-gray-100">
                    <Ionicons name="apps-outline" size={18} color="#4B5563" />
                    <Text className="text-base font-bold text-gray-900 ml-1.5">Tổng quan</Text>
                  </View>
                  {detailPost.overview ? (
                    <RenderHtml
                      contentWidth={width - 32}
                      source={{ html: detailPost.overview }}
                      baseStyle={{ color: "#374151", fontSize: 14, lineHeight: 22 }}
                    />
                  ) : (
                    <Text className="text-gray-500 italic text-sm">Không có nội dung</Text>
                  )}
                </View>

              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
