import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import {
  userGetPostDetailApi,
  userUpdatePostApi,
} from "@/services/postService";
import { uploadImageApi } from "@/services/uploadService";
import { getAllCategoryApi } from "@/services/categoryService";
import { useNotification } from "@/hooks/useNotification";
import { Category, Post } from "@/types";
import { postTypeOptions } from "@/utils/enum";
import { getImageUrl } from "@/constants/config";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError, handleError } = useNotification();

  const [form, setForm] = useState({
    title: "",
    description: "",
    overview: "",
    price: "",
    acreage: "",
    address: "",
    type: "SELL",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catModalVisible, setCatModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes]: any[] = await Promise.all([
          userGetPostDetailApi(id!),
          getAllCategoryApi({ page: 1, limit: 50 }),
        ]);
        if (postRes?.status === 200) {
          const p: Post = postRes.data;
          setForm({
            title: p.title,
            description: p.description || "",
            overview: p.overview || "",
            price: String(p.price),
            acreage: p.acreage ? String(p.acreage) : "",
            address: p.address,
            type: p.type,
          });
          setSelectedCategory(
            typeof p.category === "object"
              ? (p.category as any)?._id
              : p.category || "",
          );
          setExistingImages(p.images || []);
        }
        if (catRes?.status === 200) setCategories(catRes.data?.data || []);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });
    if (!result.canceled)
      setNewImages((prev) =>
        [...prev, ...result.assets.map((a) => a.uri)].slice(0, 10),
      );
  };

  const onSubmit = async () => {
    if (!form.title || !form.address || !form.price)
      return showError("Thiếu thông tin bắt buộc");
    setSaving(true);
    try {
      let uploadedImages = existingImages;
      if (newImages.length > 0) {
        const uploadRes: any = await uploadImageApi(newImages);
        if (uploadRes?.status === 200)
          uploadedImages = [...existingImages, ...uploadRes.data];
      }
      const data = {
        ...form,
        price: Number(form.price),
        acreage: form.acreage ? Number(form.acreage) : undefined,
        category: selectedCategory || undefined,
        images: uploadedImages,
      };
      const res: any = await userUpdatePostApi(data, id!);
      if (res?.status === 200) {
        showSuccess("Cập nhật thành công");
        router.back();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  const catName = categories.find((c) => c._id === selectedCategory)?.name;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 px-5 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row mb-4">
          {postTypeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => updateField("type", opt.value)}
              className={`flex-1 py-2.5 rounded-lg mr-2 ${form.type === opt.value ? "bg-red-500" : "bg-gray-100"}`}
            >
              <Text
                className={`text-center font-semibold ${form.type === opt.value ? "text-white" : "text-gray-600"}`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          label="Tiêu đề *"
          value={form.title}
          onChangeText={(v) => updateField("title", v)}
          mode="outlined"
          className="mb-3 bg-white"
        />
        <TextInput
          label="Địa chỉ *"
          value={form.address}
          onChangeText={(v) => updateField("address", v)}
          mode="outlined"
          className="mb-3 bg-white"
        />
        <Pressable
          onPress={() => setCatModalVisible(true)}
          className="border border-gray-300 rounded-md px-4 py-3.5 mb-3 flex-row items-center justify-between"
        >
          <Text className={catName ? "text-gray-900" : "text-gray-400"}>
            {catName || "Chọn danh mục"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
        </Pressable>
        <View className="flex-row gap-3 mb-3">
          <TextInput
            label="Giá (VNĐ) *"
            value={form.price}
            onChangeText={(v) => updateField("price", v)}
            mode="outlined"
            keyboardType="numeric"
            className="flex-1 bg-white"
          />
          <TextInput
            label="Diện tích (m²)"
            value={form.acreage}
            onChangeText={(v) => updateField("acreage", v)}
            mode="outlined"
            keyboardType="numeric"
            className="flex-1 bg-white"
          />
        </View>
        <TextInput
          label="Mô tả"
          value={form.description}
          onChangeText={(v) => updateField("description", v)}
          mode="outlined"
          multiline
          numberOfLines={5}
          className="mb-3 bg-white"
        />
        <TextInput
          label="Tổng quan"
          value={form.overview}
          onChangeText={(v) => updateField("overview", v)}
          mode="outlined"
          multiline
          numberOfLines={3}
          className="mb-3 bg-white"
        />

        <Text className="font-semibold text-gray-700 mb-2">
          Ảnh hiện tại ({existingImages.length})
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {existingImages.map((img, i) => (
            <View key={i} className="relative">
              <Image
                source={{ uri: getImageUrl(img.path) }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() =>
                  setExistingImages((p) => p.filter((_, idx) => idx !== i))
                }
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
              >
                <Ionicons name="close" size={12} color="white" />
              </Pressable>
            </View>
          ))}
          {newImages.map((uri, i) => (
            <View key={`new-${i}`} className="relative">
              <Image
                source={{ uri }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() =>
                  setNewImages((p) => p.filter((_, idx) => idx !== i))
                }
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
              >
                <Ionicons name="close" size={12} color="white" />
              </Pressable>
            </View>
          ))}
          <Pressable
            onPress={pickImages}
            className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300"
          >
            <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
          </Pressable>
        </View>

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={saving}
          disabled={saving}
          buttonColor="#DC2626"
          className="mt-2 mb-8 rounded-lg"
          contentStyle={{ paddingVertical: 4 }}
          labelStyle={{ fontSize: 16, fontWeight: "700" }}
        >
          Cập nhật
        </Button>
      </ScrollView>

      <Portal>
        <Modal
          visible={catModalVisible}
          onDismiss={() => setCatModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
            maxHeight: "60%",
          }}
        >
          <Text className="text-lg font-bold mb-3">Chọn danh mục</Text>
          <ScrollView>
            {categories.map((cat) => (
              <Pressable
                key={cat._id}
                onPress={() => {
                  setSelectedCategory(cat._id);
                  setCatModalVisible(false);
                }}
                className={`py-3 px-3 rounded-lg mb-1 ${selectedCategory === cat._id ? "bg-red-50" : ""}`}
              >
                <Text
                  className={
                    selectedCategory === cat._id
                      ? "text-red-600 font-medium"
                      : "text-gray-700"
                  }
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}
