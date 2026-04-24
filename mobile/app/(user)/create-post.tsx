import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { TextInput, Button, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import { userCreatePostApi } from "@/services/postService";
import { uploadImageApi } from "@/services/uploadService";
import { getAllCategoryApi } from "@/services/categoryService";
import { useNotification } from "@/hooks/useNotification";
import { Category } from "@/types";
import { postTypeOptions } from "@/utils/enum";

export default function CreatePostScreen() {
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [catModalVisible, setCatModalVisible] = useState(false);

  useEffect(() => {
    getAllCategoryApi({ page: 1, limit: 50 }).then((res: any) => {
      if (res?.status === 200) setCategories(res.data?.data || []);
    });
  }, []);

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });
    if (!result.canceled) {
      setImages((prev) =>
        [...prev, ...result.assets.map((a) => a.uri)].slice(0, 10),
      );
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!form.title || !form.address || !form.price || !form.description) {
      return showError("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    setLoading(true);
    try {
      let uploadedImages: any[] = [];
      if (images.length > 0) {
        const uploadRes: any = await uploadImageApi(images);
        if (uploadRes?.status === 200) {
          uploadedImages = uploadRes.data;
        }
      }

      const data = {
        ...form,
        price: Number(form.price),
        acreage: form.acreage ? Number(form.acreage) : undefined,
        category: selectedCategory || undefined,
        images: uploadedImages,
      };

      const res: any = await userCreatePostApi(data);
      if (res?.status === 201) {
        showSuccess("Đăng tin thành công! Vui lòng chờ admin duyệt.");
        router.back();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Type */}
        <Text className="font-semibold text-gray-700 mb-2">
          Loại tin đăng *
        </Text>
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
          outlineColor="#D1D5DB"
          activeOutlineColor="#DC2626"
        />
        <TextInput
          label="Địa chỉ *"
          value={form.address}
          onChangeText={(v) => updateField("address", v)}
          mode="outlined"
          className="mb-3 bg-white"
          outlineColor="#D1D5DB"
          activeOutlineColor="#DC2626"
        />

        {/* Category Picker */}
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
            outlineColor="#D1D5DB"
            activeOutlineColor="#DC2626"
          />
          <TextInput
            label="Diện tích (m²)"
            value={form.acreage}
            onChangeText={(v) => updateField("acreage", v)}
            mode="outlined"
            keyboardType="numeric"
            className="flex-1 bg-white"
            outlineColor="#D1D5DB"
            activeOutlineColor="#DC2626"
          />
        </View>

        <TextInput
          label="Mô tả chi tiết *"
          value={form.description}
          onChangeText={(v) => updateField("description", v)}
          mode="outlined"
          multiline
          numberOfLines={5}
          className="mb-3 bg-white"
          outlineColor="#D1D5DB"
          activeOutlineColor="#DC2626"
        />
        <TextInput
          label="Tổng quan"
          value={form.overview}
          onChangeText={(v) => updateField("overview", v)}
          mode="outlined"
          multiline
          numberOfLines={3}
          className="mb-3 bg-white"
          outlineColor="#D1D5DB"
          activeOutlineColor="#DC2626"
        />

        {/* Images */}
        <Text className="font-semibold text-gray-700 mb-2">
          Hình ảnh ({images.length}/10)
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri }}
                style={{ width: 90, height: 90, borderRadius: 8 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
              >
                <Ionicons name="close" size={12} color="white" />
              </Pressable>
            </View>
          ))}
          {images.length < 10 && (
            <Pressable
              onPress={pickImages}
              className="w-[90px] h-[90px] bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300"
            >
              <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs mt-1">Thêm ảnh</Text>
            </Pressable>
          )}
        </View>

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={loading}
          disabled={loading}
          buttonColor="#DC2626"
          className="mt-2 mb-8 rounded-lg"
          contentStyle={{ paddingVertical: 4 }}
          labelStyle={{ fontSize: 16, fontWeight: "700" }}
        >
          Đăng tin
        </Button>
      </ScrollView>

      {/* Category Modal */}
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
