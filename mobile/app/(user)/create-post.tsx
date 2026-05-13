import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

import { userCreatePostApi } from "@/services/postService";
import { uploadImageApi } from "@/services/uploadService";
import { getAllCategoryApi } from "@/services/categoryService";
import { useNotification } from "@/hooks/useNotification";
import { Category } from "@/types";
import { postTypeOptions } from "@/utils/enum";
import LocationPickerModal from "@/components/LocationPickerModal";

export default function CreatePostScreen() {
  const { showSuccess, showError, handleError } = useNotification();
  const scrollRef = useRef<ScrollView>(null);
  const descRef = useRef<RichEditor>(null);
  const overviewRef = useRef<RichEditor>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    overview: "",
    price: "",
    acreage: "",
    detailAddress: "",
    type: "SELL",
  });

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [locationModalVisible, setLocationModalVisible] = useState(false);

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
    if (
      !form.title ||
      !province ||
      !district ||
      !ward ||
      !form.price ||
      !form.description
    ) {
      return showError(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Địa chỉ, Giá, Mô tả)",
      );
    }

    setLoading(true);
    try {
      let uploadedImages: any[] = [];
      if (images.length > 0) {
        const uploadRes: any = await uploadImageApi(images);
        if (uploadRes?.status === 200) {
          uploadedImages = uploadRes.data?.data || uploadRes.data || [];
        }
      }

      const fullAddress = `${form.detailAddress ? form.detailAddress + ", " : ""}${ward}, ${district}, ${province}`;

      const data = {
        ...form,
        address: fullAddress,
        price: Number(form.price),
        acreage: form.acreage ? Number(form.acreage) : undefined,
        category: selectedCategory || undefined,
        images: uploadedImages.map((img: any) => ({
          filename: img.filename,
          path: img.path,
        })),
      };

      const res: any = await userCreatePostApi(data);
      if (res?.status === 201 || res?.status === 200) {
        showSuccess("Đăng tin thành công! Vui lòng chờ duyệt.");
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
      style={{ flex: 1, backgroundColor: "#fff" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4 py-2">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </Pressable>
          ) 
        }} 
      />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          Keyboard.dismiss();
          descRef.current?.blurContentEditor();
          overviewRef.current?.blurContentEditor();
        }}
      >
        <Pressable 
          style={{ flex: 1 }} 
          onPress={() => {
            Keyboard.dismiss();
            descRef.current?.blurContentEditor();
            overviewRef.current?.blurContentEditor();
          }}
          accessible={false}
        >
          <Text className="font-semibold text-gray-800 mb-3 text-base">
            Loại tin đăng <Text className="text-red-500">*</Text>
          </Text>
        <View className="flex-row mb-6">
          {postTypeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => updateField("type", opt.value)}
              className={`flex-1 h-[50px] justify-center rounded-xl mr-2 border ${form.type === opt.value ? "bg-red-50 border-red-500" : "bg-white border-gray-200"}`}
            >
              <Text
                className={`text-center font-semibold ${form.type === opt.value ? "text-red-600" : "text-gray-600"}`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mb-5">
          <Text className="font-medium text-gray-700 mb-2">
            Tiêu đề <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={form.title}
            onChangeText={(v) => updateField("title", v)}
            placeholder="Nhập tiêu đề..."
            placeholderTextColor="#9CA3AF"
            className="border border-gray-300 rounded-xl px-4 h-[50px] bg-white text-gray-900 text-base"
          />
        </View>

        {/* Location Picker */}
        <View className="mb-5">
          <Text className="font-medium text-gray-700 mb-2">
            Tỉnh/Thành, Quận/Huyện, Xã/Phường{" "}
            <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            onPress={() => setLocationModalVisible(true)}
            className="border border-gray-300 rounded-xl px-4 h-[50px] flex-row items-center justify-between bg-white"
          >
            <Text
              className={`text-base flex-1 ${province ? "text-gray-900" : "text-gray-400"}`}
              numberOfLines={1}
            >
              {province
                ? `${province} - ${district} - ${ward}`
                : "Chọn khu vực..."}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </Pressable>
        </View>

        <View className="mb-5">
          <Text className="font-medium text-gray-700 mb-2">
            Địa chỉ chi tiết
          </Text>
          <TextInput
            value={form.detailAddress}
            onChangeText={(v) => updateField("detailAddress", v)}
            placeholder="Số nhà, tên đường..."
            placeholderTextColor="#9CA3AF"
            className="border border-gray-300 rounded-xl px-4 h-[50px] bg-white text-gray-900 text-base"
          />
        </View>

        <View className="mb-5">
          <Text className="font-medium text-gray-700 mb-2">
            Loại bất động sản <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            onPress={() => setCatModalVisible(true)}
            className="border border-gray-300 rounded-xl px-4 h-[50px] flex-row items-center justify-between bg-white"
          >
            <Text
              className={`text-base ${catName ? "text-gray-900" : "text-gray-400"}`}
            >
              {catName || "Chọn loại bất động sản..."}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </Pressable>
        </View>

        <View className="flex-row mb-5">
          <View className="flex-1 mr-2">
            <Text className="font-medium text-gray-700 mb-2">
              Giá (VNĐ) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.price}
              onChangeText={(v) => updateField("price", v)}
              placeholder="Ví dụ: 1000000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 h-[50px] bg-white text-gray-900 text-base"
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="font-medium text-gray-700 mb-2">
              Diện tích (m²)
            </Text>
            <TextInput
              value={form.acreage}
              onChangeText={(v) => updateField("acreage", v)}
              placeholder="Ví dụ: 50"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 h-[50px] bg-white text-gray-900 text-base"
            />
          </View>
        </View>

        <Text className="font-medium text-gray-700 mb-2">
          Mô tả chi tiết <Text className="text-red-500">*</Text>
        </Text>
        <View
          className="border border-gray-300 rounded-xl overflow-hidden mb-6"
          style={{ minHeight: 200, backgroundColor: "white" }}
        >
          <RichToolbar
            editor={descRef}
            actions={[
              actions.keyboard,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertOrderedList,
              actions.insertBulletsList,
            ]}
            iconMap={{
              [actions.keyboard]: () => <Ionicons name="chevron-down" size={22} color="#4B5563" />,
            }}
            iconTint="#4B5563"
            selectedIconTint="#2563EB"
            style={{
              backgroundColor: "#F9FAFB",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          />
          <RichEditor
            ref={descRef}
            onChange={(html) => updateField("description", html)}
            placeholder="Nhập mô tả chi tiết..."
            initialHeight={200}
            editorStyle={{ backgroundColor: "#ffffff" }}
            onFocus={() => scrollRef.current?.scrollTo({ y: 400, animated: true })}
          />
        </View>

        <Text className="font-medium text-gray-700 mb-2">Tổng quan</Text>
        <View
          className="border border-gray-300 rounded-xl overflow-hidden mb-6"
          style={{ minHeight: 150, backgroundColor: "white" }}
        >
          <RichToolbar
            editor={overviewRef}
            actions={[
              actions.keyboard,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertOrderedList,
              actions.insertBulletsList,
            ]}
            iconMap={{
              [actions.keyboard]: () => <Ionicons name="chevron-down" size={22} color="#4B5563" />,
            }}
            iconTint="#4B5563"
            selectedIconTint="#2563EB"
            style={{
              backgroundColor: "#F9FAFB",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          />
          <RichEditor
            ref={overviewRef}
            onChange={(html) => updateField("overview", html)}
            placeholder="Thông tin tổng quan..."
            initialHeight={150}
            editorStyle={{ backgroundColor: "#ffffff" }}
            onFocus={() => scrollRef.current?.scrollTo({ y: 650, animated: true })}
          />
        </View>

        <Text className="font-medium text-gray-700 mb-3">
          Hình ảnh ({images.length}/10)
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri }}
                style={{ width: 90, height: 90, borderRadius: 8 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white shadow-sm"
              >
                <Ionicons name="close" size={14} color="white" />
              </Pressable>
            </View>
          ))}
          {images.length < 10 && (
            <Pressable
              onPress={pickImages}
              className="w-[90px] h-[90px] bg-gray-50 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
            >
              <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs mt-1">Thêm ảnh</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className={`mt-4 mb-10 py-4 rounded-xl items-center justify-center ${loading ? "bg-red-300" : "bg-red-600"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Đăng tin</Text>
          )}
        </Pressable>
        </Pressable>
      </ScrollView>

      {/* Category Modal - Refactored to standard react-native Modal */}
      <Modal visible={catModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white w-full rounded-2xl max-h-[70%] p-5 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Chọn danh mục
              </Text>
              <Pressable
                onPress={() => setCatModalVisible(false)}
                className="p-1"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map((cat) => (
                <Pressable
                  key={cat._id}
                  onPress={() => {
                    setSelectedCategory(cat._id);
                    setCatModalVisible(false);
                  }}
                  className={`py-4 px-4 rounded-xl mb-2 flex-row justify-between items-center ${selectedCategory === cat._id ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}
                >
                  <Text
                    className={`text-base ${selectedCategory === cat._id ? "text-red-600 font-bold" : "text-gray-700"}`}
                  >
                    {cat.name}
                  </Text>
                  {selectedCategory === cat._id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#DC2626"
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <LocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onSelect={(p, d, w) => {
          setProvince(p);
          setDistrict(d);
          setWard(w);
        }}
      />
    </KeyboardAvoidingView>
  );
}
