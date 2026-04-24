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
  getAllCategoryApi,
  createCategoryApi,
  adminEditCategoryApi,
  deleteCategoryApi,
} from "@/services/categoryService";
import { useNotification } from "@/hooks/useNotification";
import { Category } from "@/types";

export default function AdminCategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchData = useCallback(async () => {
    try {
      const res: any = await getAllCategoryApi({ page: 1, limit: 100 });
      if (res?.status === 200) setCategories(res.data?.data || []);
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
    setForm({ name: "", description: "" });
    setModalVisible(true);
  };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await adminEditCategoryApi(form, editing._id);
        showSuccess("Cập nhật thành công");
      } else {
        await createCategoryApi(form);
        showSuccess("Tạo thành công");
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategoryApi(id);
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
        data={categories}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="folder-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4">Chưa có danh mục</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-bold text-gray-900">{item.name}</Text>
              {item.description && (
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                  {item.description}
                </Text>
              )}
            </View>
            <View className="flex-row gap-1">
              <Pressable
                onPress={() => openEdit(item)}
                className="bg-blue-50 p-2 rounded-lg"
              >
                <Ionicons name="create-outline" size={18} color="#2563EB" />
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item._id)}
                className="bg-red-50 p-2 rounded-lg"
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
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
            {editing ? "Sửa danh mục" : "Thêm danh mục"}
          </Text>
          <TextInput
            label="Tên danh mục *"
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            mode="outlined"
            className="mb-3 bg-white"
          />
          <TextInput
            label="Mô tả"
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
            mode="outlined"
            multiline
            className="mb-3 bg-white"
          />
          <View className="flex-row gap-3">
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
