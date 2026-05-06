import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  TextInput as RNTextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button as PaperButton, TextInput } from "react-native-paper";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  getAllNewsApi,
  createNewsApi,
  adminEditNewsApi,
  deleteNewsApi,
} from "@/services/newsService";
import { uploadImageApi } from "@/services/uploadService";
import { useNotification } from "@/hooks/useNotification";
import { News } from "@/types";
import { formatDateTime } from "@/utils";
import { getImageUrl } from "@/constants/config";

export default function AdminNewsScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    thumb: "",
  });
  const [localThumb, setLocalThumb] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const richText = useRef<RichEditor>(null);

  const fetchData = useCallback(async () => {
    try {
      const res: any = await getAllNewsApi({ page: 1, limit: 100 });
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

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", content: "", tags: "", thumb: "" });
    setLocalThumb("");
    setModalVisible(true);
  };

  const openEdit = (item: News) => {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content,
      tags: item.tags?.join(", ") || "",
      thumb: item.thumb || "",
    });
    setLocalThumb("");
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const localUri = result.assets[0].uri;
        setLocalThumb(localUri);
        setUploading(true);

        uploadImageApi([localUri])
          .then((res: any) => {
            const uploadedPath =
              res?.data?.[0]?.path ||
              res?.data?.data?.[0]?.path ||
              res?.data?.url ||
              res?.url;
            if (uploadedPath) {
              setForm((p) => ({ ...p, thumb: uploadedPath }));
            } else {
              showSuccess("Không nhận được ảnh trả về từ server");
            }
          })
          .catch((e) => {
            handleError(e);
          })
          .finally(() => {
            setUploading(false);
          });
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (editing) {
        await adminEditNewsApi(payload, editing._id);
        showSuccess("Cập nhật thành công");
      } else {
        await createNewsApi(payload);
        showSuccess("Tạo tin tức thành công");
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: News) => {
    Alert.alert("Xác nhận", `Xóa "${item.title}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNewsApi(item._id);
            showSuccess("Đã xóa tin tức");
            fetchData();
          } catch (e) {
            handleError(e);
          }
        },
      },
    ]);
  };

  const filtered = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
            </Pressable>
            <View>
              <Text className="text-gray-900 text-xl font-bold">Tin tức</Text>
              <Text className="text-gray-500 text-sm">Quản lý bài viết</Text>
            </View>
          </View>
        </View>

        {/* Search & Add */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              className="flex-1 ml-2 text-gray-900 text-sm h-full"
              placeholder="Tìm theo tiêu đề..."
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
          <Pressable
            onPress={openCreate}
            className="bg-gray-900 h-11 w-11 rounded-xl items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          Tổng: {filtered.length} tin tức
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
            <Ionicons name="newspaper-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">Không có tin tức</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/news/${item._id}`)}
            className="bg-white rounded-xl overflow-hidden mb-3 shadow-sm border border-gray-100"
          >
            {item.thumb ? (
              <Image
                source={{ uri: getImageUrl(item.thumb) }}
                style={{ width: "100%", height: 140 }}
                contentFit="cover"
              />
            ) : (
              <View className="w-full h-32 bg-gray-100 items-center justify-center">
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              </View>
            )}
            <View className="p-4">
              <Text
                className="font-bold text-gray-900 text-base"
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {item.tags && item.tags.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5 mt-2">
                  {item.tags.map((t) => (
                    <View
                      key={t}
                      className="bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100"
                    >
                      <Text className="text-blue-700 text-xs font-medium">
                        {t}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {item.createdAt && (
                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-xs ml-1">
                    {formatDateTime(item.createdAt)}
                  </Text>
                </View>
              )}

              <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    openEdit(item);
                  }}
                  className="bg-blue-50 px-3 py-1.5 rounded-lg flex-row items-center flex-1 justify-center"
                >
                  <Ionicons name="create-outline" size={16} color="#2563EB" />
                  <Text className="text-blue-600 text-sm ml-1 font-semibold">
                    Sửa
                  </Text>
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex-row items-center flex-1 justify-center"
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-sm ml-1 font-semibold">
                    Xóa
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl h-[85%]">
              {/* Header Modal */}
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">
                  {editing ? "Sửa tin tức" : "Thêm tin tức"}
                </Text>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setModalVisible(false);
                  }}
                  className="p-1.5 bg-gray-100 rounded-full"
                >
                  <Ionicons name="close" size={20} color="#4B5563" />
                </Pressable>
              </View>

              <ScrollView
                className="p-5"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Ảnh đại diện (Thumbnail)
                </Text>
                <Pressable
                  onPress={handlePickImage}
                  className="bg-gray-50 border border-gray-200 border-dashed rounded-xl h-40 mb-4 items-center justify-center overflow-hidden"
                >
                  {localThumb || form.thumb ? (
                    <>
                      <Image
                        source={{ uri: localThumb || getImageUrl(form.thumb) }}
                        style={{ width: "100%", height: "100%", opacity: uploading ? 0.6 : 1 }}
                        contentFit="cover"
                      />
                      {uploading && (
                        <View className="absolute inset-0 items-center justify-center">
                          <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                      )}
                    </>
                  ) : (
                    <View className="items-center justify-center">
                      <Ionicons
                        name="cloud-upload-outline"
                        size={32}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-500 mt-2 font-medium">
                        Nhấn để chọn ảnh
                      </Text>
                    </View>
                  )}
                  {(localThumb || form.thumb) && !uploading && (
                    <View className="absolute bottom-2 right-2 bg-black/60 px-3 py-1.5 rounded-lg flex-row items-center">
                      <Ionicons name="camera-outline" size={16} color="white" />
                      <Text className="text-white text-xs ml-1 font-medium">
                        Đổi ảnh
                      </Text>
                    </View>
                  )}
                </Pressable>

                <TextInput
                  label="Tiêu đề *"
                  value={form.title}
                  onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
                  mode="outlined"
                  style={{ backgroundColor: "white", marginBottom: 16 }}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#111827"
                  textColor="#111827"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />

                <Text className="text-gray-700 text-sm font-medium mb-1">
                  Nội dung chi tiết *
                </Text>
                <View className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white min-h-[300px]">
                  <RichToolbar
                    editor={richText}
                    actions={[
                      actions.setBold,
                      actions.setItalic,
                      actions.setUnderline,
                      actions.heading1,
                      actions.heading2,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.undo,
                      actions.redo,
                    ]}
                    iconTint="#4B5563"
                    selectedIconTint="#DC2626"
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E7EB",
                    }}
                  />
                  <ScrollView nestedScrollEnabled className="flex-1 bg-white">
                    <RichEditor
                      ref={richText}
                      initialContentHTML={form.content}
                      onChange={(html) =>
                        setForm((p) => ({ ...p, content: html }))
                      }
                      placeholder="Nhập nội dung bài viết..."
                      editorStyle={{
                        backgroundColor: "white",
                        color: "#111827",
                        placeholderColor: "#9CA3AF",
                        cssText:
                          "font-family: sans-serif; font-size: 14px; padding: 8px;",
                      }}
                      containerStyle={{ flex: 1 }}
                    />
                  </ScrollView>
                </View>

                <TextInput
                  label="Tags (cách nhau bằng dấu phẩy)"
                  value={form.tags}
                  onChangeText={(v) => setForm((p) => ({ ...p, tags: v }))}
                  mode="outlined"
                  style={{ backgroundColor: "white", marginBottom: 24 }}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#111827"
                  textColor="#111827"
                  placeholder="Ví dụ: công nghệ, bất động sản"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={Keyboard.dismiss}
                />

                <PaperButton
                  mode="contained"
                  onPress={handleSave}
                  loading={saving || uploading}
                  disabled={
                    saving || uploading || !form.title.trim() || !form.content.trim()
                  }
                  style={{ borderRadius: 12 }}
                  contentStyle={{ height: 48 }}
                  buttonColor="#111827"
                  textColor="white"
                  labelStyle={{ fontSize: 16, fontWeight: "bold" }}
                >
                  Lưu thông tin
                </PaperButton>
                <View className="h-10" />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
