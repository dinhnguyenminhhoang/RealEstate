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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Modal, Portal, TextInput } from "react-native-paper";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  getAllNewsApi,
  createNewsApi,
  adminEditNewsApi,
  deleteNewsApi,
} from "@/services/newsService";
import { useNotification } from "@/hooks/useNotification";
import { News } from "@/types";
import { formatDateTime } from "@/utils";
import { getImageUrl } from "@/constants/config";

export default function AdminNewsScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [saving, setSaving] = useState(false);

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
    setForm({ title: "", content: "", tags: "" });
    setModalVisible(true);
  };

  const openEdit = (item: News) => {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content,
      tags: item.tags?.join(", ") || "",
    });
    setModalVisible(true);
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
            showSuccess("Đã xóa");
            fetchData();
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
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <Text className="text-gray-500 text-sm">{news.length} tin tức</Text>
        <Pressable
          onPress={openCreate}
          className="bg-red-500 px-3.5 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={18} color="white" />
          <Text className="text-white text-sm font-semibold ml-1">
            Thêm tin
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={news}
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
            <Text className="text-gray-400 text-lg mt-4">Chưa có tin tức</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/news/${item._id}`)}
            className="bg-white rounded-xl overflow-hidden mb-2.5 shadow-sm"
          >
            {/* Thumbnail */}
            {item.thumb && (
              <Image
                source={{ uri: getImageUrl(item.thumb) }}
                style={{ width: "100%", height: 140 }}
                contentFit="cover"
              />
            )}
            <View className="p-4">
              <Text
                className="font-bold text-gray-900 text-base"
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {item.tags && item.tags.length > 0 && (
                <View className="flex-row flex-wrap gap-1 mt-2">
                  {item.tags.map((t) => (
                    <View
                      key={t}
                      className="bg-blue-50 px-2 py-0.5 rounded-full"
                    >
                      <Text className="text-blue-600 text-xs">{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              {item.createdAt && (
                <Text className="text-gray-400 text-xs mt-2">
                  {formatDateTime(item.createdAt)}
                </Text>
              )}

              {/* Actions */}
              <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
                <Pressable
                  onPress={() => openEdit(item)}
                  className="bg-blue-50 px-3 py-2 rounded-lg flex-row items-center flex-1 justify-center"
                >
                  <Ionicons name="create-outline" size={16} color="#2563EB" />
                  <Text className="text-blue-600 text-sm ml-1 font-medium">
                    Sửa
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  className="bg-red-50 px-3 py-2 rounded-lg flex-row items-center flex-1 justify-center"
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-sm ml-1 font-medium">
                    Xóa
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 16,
            borderRadius: 16,
            padding: 20,
            maxHeight: "85%",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-bold text-gray-900 mb-4">
              {editing ? "Sửa tin tức" : "Thêm tin tức mới"}
            </Text>
            <TextInput
              label="Tiêu đề *"
              value={form.title}
              onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
              mode="outlined"
              className="mb-3 bg-white"
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
            />
            <TextInput
              label="Nội dung *"
              value={form.content}
              onChangeText={(v) => setForm((p) => ({ ...p, content: v }))}
              mode="outlined"
              multiline
              numberOfLines={8}
              className="mb-3 bg-white"
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
            />
            <TextInput
              label="Tags (phân cách bằng dấu phẩy)"
              value={form.tags}
              onChangeText={(v) => setForm((p) => ({ ...p, tags: v }))}
              mode="outlined"
              className="mb-4 bg-white"
              outlineColor="#D1D5DB"
              activeOutlineColor="#DC2626"
              placeholder="ví dụ: bất động sản, đầu tư, thị trường"
            />
            <View className="flex-row gap-3">
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                className="flex-1"
                textColor="#6B7280"
                style={{ borderColor: "#D1D5DB" }}
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving || !form.title.trim() || !form.content.trim()}
                buttonColor="#DC2626"
                className="flex-1"
              >
                Lưu
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}
