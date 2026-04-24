import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Post } from "@/types";
import { formatMoneyVND } from "@/utils";
import { getImageUrl } from "@/constants/config";

const { width } = Dimensions.get("window");

interface PostCardProps {
  listing: Post;
  horizontal?: boolean;
}

export default function PostCard({
  listing,
  horizontal = false,
}: PostCardProps) {
  const imageUrl = listing.images?.[0]?.path
    ? getImageUrl(listing.images[0].path)
    : null;

  const categoryName =
    typeof listing.category === "object" ? listing.category?.name : "";

  const handlePress = () => {
    router.push(`/property/${listing._id}`);
  };

  if (horizontal) {
    return (
      <Pressable
        onPress={handlePress}
        className="bg-white rounded-xl overflow-hidden mr-4 shadow-sm"
        style={{ width: width * 0.6 }}
      >
        <View className="h-36 bg-gray-200">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            </View>
          )}
          <View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded">
            <Text className="text-white text-xs font-semibold">
              {listing.type === "SELL" ? "Bán" : "Cho thuê"}
            </Text>
          </View>
        </View>
        <View className="p-3">
          <Text className="font-bold text-gray-900 text-sm" numberOfLines={2}>
            {listing.title}
          </Text>
          <Text className="text-red-600 font-bold text-base mt-1">
            {formatMoneyVND(listing.price)}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text
              className="text-gray-500 text-xs ml-1 flex-1"
              numberOfLines={1}
            >
              {listing.address}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-xl overflow-hidden shadow-sm mb-3"
    >
      <View className="h-48 bg-gray-200">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          </View>
        )}
        <View className="absolute top-3 left-3 bg-red-500 px-2.5 py-1 rounded">
          <Text className="text-white text-xs font-bold">
            {listing.type === "SELL" ? "Bán" : "Cho thuê"}
          </Text>
        </View>
        {listing.verification && (
          <View className="absolute top-3 right-3 bg-green-500 px-2 py-1 rounded">
            <Text className="text-white text-xs font-semibold">Đã duyệt</Text>
          </View>
        )}
      </View>

      <View className="p-4">
        <Text className="font-bold text-gray-900 text-base" numberOfLines={2}>
          {listing.title}
        </Text>

        <Text className="text-red-600 font-bold text-lg mt-1">
          {formatMoneyVND(listing.price)}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          {listing.acreage ? (
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={14} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {listing.acreage} m²
              </Text>
            </View>
          ) : null}
          {categoryName ? (
            <View className="bg-blue-50 px-2 py-0.5 rounded">
              <Text className="text-blue-600 text-xs font-medium">
                {categoryName}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center mt-2">
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm ml-1 flex-1" numberOfLines={1}>
            {listing.address}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">
              {listing.views || 0}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">
              {listing.favorites || 0}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
