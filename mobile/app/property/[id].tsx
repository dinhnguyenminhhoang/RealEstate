import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Button, TextInput, Modal, Portal, Divider } from "react-native-paper";

import { getPostDetailApi, updateViewApi } from "@/services/postService";
import { savePostApi } from "@/services/userService";
import { createNewReportApi } from "@/services/reportService";
import { createApplicationApi } from "@/services/applicationService";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/hooks/useNotification";
import { Post } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";
import { getImageUrl } from "@/constants/config";
import { reportReasons } from "@/utils/enum";
import RenderHtml from "react-native-render-html";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, handleError } = useNotification();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [applicationVisible, setApplicationVisible] = useState(false);
  const [appForm, setAppForm] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });

  const fetchPost = useCallback(async () => {
    if (!id) return;
    try {
      const res: any = await getPostDetailApi(id, user?._id);
      if (res?.status === 200) {
        setPost(res.data);
        setIsFavorite(res.data?.isFavorite || false);
      }
      await updateViewApi(id);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id, user?._id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (user) {
      setAppForm((prev) => ({
        ...prev,
        name: user.userName || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleFavorite = async () => {
    if (!isAuthenticated) return showError("Vui lòng đăng nhập");
    try {
      await savePostApi(id!);
      setIsFavorite(true);
      showSuccess("Đã lưu vào yêu thích");
    } catch (e) {
      handleError(e);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return showError("Chọn lý do báo cáo");
    try {
      await createNewReportApi({
        post: id,
        reason: reportReason,
        content: reportContent,
      });
      showSuccess("Đã gửi báo cáo");
      setReportVisible(false);
      setReportReason("");
      setReportContent("");
    } catch (e) {
      handleError(e);
    }
  };

  const handleApplication = async () => {
    if (!appForm.name || !appForm.phone || !appForm.email)
      return showError("Điền đầy đủ thông tin");
    try {
      await createApplicationApi({ ...appForm, post: id });
      showSuccess("Đã gửi liên hệ");
      setApplicationVisible(false);
    } catch (e) {
      handleError(e);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-400 text-lg mt-4">
          Không tìm thấy bài đăng
        </Text>
      </View>
    );
  }

  const author = typeof post.author === "object" ? post.author : null;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View className="h-72 bg-gray-200">
          {post.images?.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  setActiveImageIndex(
                    Math.round(e.nativeEvent.contentOffset.x / width),
                  );
                }}
              >
                {post.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: getImageUrl(img.path) }}
                    style={{ width, height: 288 }}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
              <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded">
                <Text className="text-white text-xs">
                  {activeImageIndex + 1}/{post.images.length}
                </Text>
              </View>
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="image-outline" size={64} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="px-5 pt-4">
          <View className="flex-row items-center mb-2">
            <View
              className={`px-2.5 py-1 rounded ${post.type === "SELL" ? "bg-red-500" : "bg-blue-500"}`}
            >
              <Text className="text-white text-xs font-bold">
                {post.type === "SELL" ? "Bán" : "Cho thuê"}
              </Text>
            </View>
            {post.verification && (
              <View className="bg-green-100 px-2 py-1 rounded ml-2">
                <Text className="text-green-700 text-xs font-semibold">
                  ✓ Đã duyệt
                </Text>
              </View>
            )}
          </View>

          <Text className="text-xl font-bold text-gray-900">{post.title}</Text>
          <Text className="text-2xl font-bold text-red-600 mt-2">
            {formatMoneyVND(post.price)}
          </Text>

          <View className="flex-row items-center mt-3">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1 flex-1">{post.address}</Text>
          </View>

          <View className="flex-row mt-3 gap-4">
            {post.acreage ? (
              <View className="flex-row items-center">
                <Ionicons name="resize-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-1">{post.acreage} m²</Text>
              </View>
            ) : null}
            <View className="flex-row items-center">
              <Ionicons name="eye-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{post.views} lượt xem</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{post.favorites}</Text>
            </View>
          </View>

          {post.createdAt && (
            <Text className="text-gray-400 text-sm mt-2">
              {formatTimeAgo(post.createdAt)}
            </Text>
          )}
        </View>

        <Divider className="my-4" />

        {/* Description */}
        <View className="px-5">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Mô tả chi tiết
          </Text>
          {post.description ? (
            <RenderHtml
              contentWidth={width - 40}
              source={{ html: post.description }}
              baseStyle={{ color: "#374151", fontSize: 15, lineHeight: 24 }}
            />
          ) : (
            <Text className="text-gray-500">Không có mô tả</Text>
          )}
        </View>

        {post.overview && (
          <>
            <Divider className="my-4" />
            <View className="px-5">
              <Text className="text-lg font-bold text-gray-900 mb-2">
                Tổng quan
              </Text>
              <Text className="text-gray-600 leading-6">{post.overview}</Text>
            </View>
          </>
        )}

        <Divider className="my-4" />

        {/* Author */}
        {author && (
          <View className="px-5 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Thông tin liên hệ
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center">
                  <Text className="text-red-600 font-bold text-lg">
                    {author.userName?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
                <View className="ml-3">
                  <Text className="font-bold text-gray-900">
                    {author.userName}
                  </Text>
                  <Text className="text-gray-500 text-sm">{author.email}</Text>
                </View>
              </View>
              <View className="flex-row mt-3 gap-3">
                <Button
                  mode="contained"
                  icon="phone"
                  onPress={() => Linking.openURL(`tel:${author.phone}`)}
                  buttonColor="#16A34A"
                  className="flex-1"
                  compact
                >
                  {author.phone}
                </Button>
                <Button
                  mode="outlined"
                  icon="email"
                  onPress={() => Linking.openURL(`mailto:${author.email}`)}
                  className="flex-1"
                  compact
                >
                  Email
                </Button>
              </View>
            </View>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3 flex-row gap-3">
        <Pressable
          onPress={handleFavorite}
          className="items-center justify-center px-3"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={isFavorite ? "#EF4444" : "#6B7280"}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            isAuthenticated
              ? setReportVisible(true)
              : showError("Vui lòng đăng nhập")
          }
          className="items-center justify-center px-3"
        >
          <Ionicons name="flag-outline" size={24} color="#6B7280" />
        </Pressable>
        <Button
          mode="contained"
          onPress={() =>
            isAuthenticated
              ? setApplicationVisible(true)
              : showError("Vui lòng đăng nhập")
          }
          buttonColor="#DC2626"
          className="flex-1"
          contentStyle={{ paddingVertical: 2 }}
        >
          Liên hệ ngay
        </Button>
      </View>

      {/* Report Modal */}
      <Portal>
        <Modal
          visible={reportVisible}
          onDismiss={() => setReportVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text className="text-lg font-bold mb-4">Báo cáo bài đăng</Text>
          <Text className="text-sm text-gray-600 mb-2">Chọn lý do:</Text>
          {reportReasons.map((reason) => (
            <Pressable
              key={reason}
              onPress={() => setReportReason(reason)}
              className={`py-2.5 px-3 rounded-lg mb-1.5 ${reportReason === reason ? "bg-red-50 border border-red-300" : "bg-gray-50"}`}
            >
              <Text
                className={
                  reportReason === reason
                    ? "text-red-600 font-medium"
                    : "text-gray-700"
                }
              >
                {reason}
              </Text>
            </Pressable>
          ))}
          <TextInput
            label="Chi tiết (tùy chọn)"
            value={reportContent}
            onChangeText={setReportContent}
            mode="outlined"
            multiline
            numberOfLines={3}
            className="mt-3 bg-white"
          />
          <View className="flex-row mt-4 gap-3">
            <Button
              mode="outlined"
              onPress={() => setReportVisible(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleReport}
              buttonColor="#DC2626"
              className="flex-1"
            >
              Gửi báo cáo
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Application Modal */}
      <Portal>
        <Modal
          visible={applicationVisible}
          onDismiss={() => setApplicationVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text className="text-lg font-bold mb-4">Liên hệ bài đăng</Text>
          <TextInput
            label="Họ tên *"
            value={appForm.name}
            onChangeText={(v) => setAppForm((p) => ({ ...p, name: v }))}
            mode="outlined"
            className="mb-3 bg-white"
          />
          <TextInput
            label="Số điện thoại *"
            value={appForm.phone}
            onChangeText={(v) => setAppForm((p) => ({ ...p, phone: v }))}
            mode="outlined"
            keyboardType="phone-pad"
            className="mb-3 bg-white"
          />
          <TextInput
            label="Email *"
            value={appForm.email}
            onChangeText={(v) => setAppForm((p) => ({ ...p, email: v }))}
            mode="outlined"
            keyboardType="email-address"
            className="mb-3 bg-white"
          />
          <TextInput
            label="Nội dung"
            value={appForm.content}
            onChangeText={(v) => setAppForm((p) => ({ ...p, content: v }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            className="mb-3 bg-white"
          />
          <View className="flex-row gap-3">
            <Button
              mode="outlined"
              onPress={() => setApplicationVisible(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleApplication}
              buttonColor="#DC2626"
              className="flex-1"
            >
              Gửi
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
