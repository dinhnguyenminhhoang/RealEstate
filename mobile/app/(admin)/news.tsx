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
import { Button, Modal, Portal, TextInput } from "react-native-paper";

import {
  getAllNewsApi,
  createNewsApi,
  adminEditNewsApi,
  deleteNewsApi,
} from "@/services/newsService";
import { useNotification } from "@/hooks/useNotification";
import { News } from "@/types";
import { formatDateTime } from "@/utils";

export default function AdminNewsScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

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
        showSuccess("Tạo thành công");
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Xóa tin tức này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNewsApi(id);
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
      <FlatList
        data={news}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="newspaper-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4">Chưa có tin tức</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="font-bold text-gray-900" numberOfLines={2}>
              {item.title}
            </Text>
            {item.tags && item.tags.length > 0 && (
              <View className="flex-row flex-wrap mt-1.5 gap-1">
                {item.tags.slice(0, 3).map((t) => (
                  <View key={t} className="bg-blue-50 px-2 py-0.5 rounded">
                    <Text className="text-blue-600 text-xs">{t}</Text>
                  </View>
                ))}
              </View>
            )}
            {item.createdAt && (
              <Text className="text-gray-400 text-xs mt-1.5">
                {formatDateTime(item.createdAt)}
              </Text>
            )}
            <View className="flex-row gap-2 mt-3">
              <Pressable
                onPress={() => openEdit(item)}
                className="bg-blue-50 px-3 py-1.5 rounded-lg flex-row items-center"
              >
                <Ionicons name="create-outline" size={16} color="#2563EB" />
                <Text className="text-blue-600 text-sm ml-1">Sửa</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item._id)}
                className="bg-red-50 px-3 py-1.5 rounded-lg flex-row items-center"
              >
                <Ionicons name="trash-outline" size={16} color="#DC2626" />
                <Text className="text-red-600 text-sm ml-1">Xóa</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Button
        mode="contained"
        icon="plus"
        onPress={openCreate}
        buttonColor="#DC2626"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          borderRadius: 28,
        }}
        contentStyle={{ paddingVertical: 4 }}
      >
        Thêm
      </Button>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text className="text-lg font-bold mb-3">
            {editing ? "Sửa tin tức" : "Thêm tin tức"}
          </Text>
          <TextInput
            label="Tiêu đề *"
            value={form.title}
            onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          <TextInput
            label="Nội dung *"
            value={form.content}
            onChangeText={(v) => setForm((p) => ({ ...p, content: v }))}
            mode="outlined"
            multiline
            numberOfLines={6}
            className="mb-2 bg-white"
          />
          <TextInput
            label="Tags (cách nhau dấu phẩy)"
            value={form.tags}
            onChangeText={(v) => setForm((p) => ({ ...p, tags: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          <View className="flex-row gap-3 mt-2">
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              buttonColor="#DC2626"
              className="flex-1"
            >
              Lưu
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
