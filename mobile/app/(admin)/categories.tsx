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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { router } from "expo-router";
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
  const { showSuccess, showError, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

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
    if (!form.name.trim()) {
      showError("Vui lòng nhập tên danh mục");
      return;
    }
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

  const filtered = search
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase()) ||
          (cat.description &&
            cat.description.toLowerCase().includes(search.toLowerCase())),
      )
    : categories;

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center mb-4 mt-2">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
          </Pressable>
          <View>
            <Text className="text-gray-900 text-xl font-bold">Danh mục</Text>
            <Text className="text-gray-500 text-sm">Quản lý thể loại BĐS</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              className="flex-1 ml-2 text-gray-900 text-sm h-full"
              placeholder="Tìm theo tên..."
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
          Tổng: {categories.length} danh mục
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  marginHorizontal: 16,
                  borderRadius: 16,
                  maxHeight: "85%",
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 12,
                  }}
                >
                  <Text className="text-lg font-bold text-gray-900">
                    {editing ? "Sửa danh mục" : "Thêm danh mục mới"}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setModalVisible(false);
                    }}
                    className="p-1"
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </Pressable>
                </View>

                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <TextInput
                    label="Tên danh mục *"
                    value={form.name}
                    onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                    mode="outlined"
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    multiline={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    left={<TextInput.Icon icon="folder-outline" />}
                  />
                  <TextInput
                    label="Mô tả"
                    value={form.description}
                    onChangeText={(v) =>
                      setForm((p) => ({ ...p, description: v }))
                    }
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 16 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    left={<TextInput.Icon icon="text-box-outline" />}
                  />
                  <View className="flex-row gap-3 justify-end mt-2">
                    <Button
                      mode="outlined"
                      onPress={() => {
                        Keyboard.dismiss();
                        setModalVisible(false);
                      }}
                      textColor="#DC2626"
                      style={{ borderColor: "#DC2626" }}
                    >
                      Hủy
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        Keyboard.dismiss();
                        handleSave();
                      }}
                      loading={saving}
                      disabled={saving}
                      buttonColor="#2563EB"
                    >
                      Lưu
                    </Button>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
