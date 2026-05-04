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
  const [saving, setSaving] = useState(false);

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
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await adminEditCategoryApi(form, editing._id);
        showSuccess("Cập nhật thành công");
      } else {
        await createCategoryApi(form);
        showSuccess("Tạo danh mục thành công");
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat: Category) => {
    Alert.alert("Xác nhận", `Xóa danh mục "${cat.name}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategoryApi(cat._id);
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
      {/* Header */}
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <Text className="text-gray-500 text-sm">
          {categories.length} danh mục
        </Text>
        <Pressable
          onPress={openCreate}
          className="bg-red-500 px-3.5 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={18} color="white" />
          <Text className="text-white text-sm font-semibold ml-1">
            Thêm mới
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
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
            <Ionicons name="folder-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">Chưa có danh mục</Text>
            <Pressable
              onPress={openCreate}
              className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">
                Tạo danh mục đầu tiên
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => (
          <View className="bg-white rounded-xl p-4 mb-2.5 shadow-sm flex-row items-center">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: `hsl(${index * 40}, 80%, 95%)` }}
            >
              <Ionicons
                name="folder"
                size={20}
                color={`hsl(${index * 40}, 70%, 50%)`}
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base">
                {item.name}
              </Text>
              {item.description && (
                <Text
                  className="text-gray-500 text-sm mt-0.5"
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}
            </View>
            <View className="flex-row gap-1.5">
              <Pressable
                onPress={() => openEdit(item)}
                className="bg-blue-50 p-2 rounded-lg"
              >
                <Ionicons name="create-outline" size={18} color="#2563EB" />
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item)}
                className="bg-red-50 p-2 rounded-lg"
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modal */}
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
          <Text className="text-lg font-bold text-gray-900 mb-4">
            {editing ? "Sửa danh mục" : "Thêm danh mục mới"}
          </Text>
          <TextInput
            label="Tên danh mục *"
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            mode="outlined"
            className="mb-3 bg-white"
            outlineColor="#D1D5DB"
            activeOutlineColor="#DC2626"
          />
          <TextInput
            label="Mô tả"
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            className="mb-4 bg-white"
            outlineColor="#D1D5DB"
            activeOutlineColor="#DC2626"
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
              disabled={saving || !form.name.trim()}
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
