import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  TextInput as RNTextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip, Button, Modal, Portal, RadioButton } from "react-native-paper";

import PostCard from "@/components/PostCard";
import { getAllPostApi } from "@/services/postService";
import { getAllCategoryApi } from "@/services/categoryService";
import { Post, Category, PaginationMeta, PostFilters } from "@/types";
import { priceRanges, areaRanges } from "@/utils/enum";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
  });

  // Filters
  const [activeType, setActiveType] = useState<"SELL" | "RENT">("SELL");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.category || null,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Filter modal
  const [filterVisible, setFilterVisible] = useState(false);

  const fetchPosts = useCallback(
    async (page = 1, reset = false) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const filters: PostFilters = { type: activeType };
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedPrice) filters.priceRange = selectedPrice;
        if (selectedArea) filters.area = selectedArea;
        if (searchText.trim()) filters.address = searchText.trim();

        const res: any = await getAllPostApi({ page, limit: 10, filters });
        if (res?.status === 200) {
          const newData = res.data?.data || [];
          setPosts(reset || page === 1 ? newData : [...posts, ...newData]);
          setMeta(res.data?.meta || meta);
        }
      } catch (error) {
        console.log("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeType, selectedCategory, selectedPrice, selectedArea, searchText],
  );

  useEffect(() => {
    fetchPosts(1, true);
  }, [activeType, selectedCategory, selectedPrice, selectedArea]);

  useEffect(() => {
    getAllCategoryApi({ page: 1, limit: 50 }).then((res: any) => {
      if (res?.status === 200) setCategories(res.data?.data || []);
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(1, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const loadMore = () => {
    if (!loadingMore && meta.page < meta.totalPages) {
      fetchPosts(meta.page + 1);
    }
  };

  const handleSearch = () => {
    fetchPosts(1, true);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPrice(null);
    setSelectedArea(null);
    setSearchText("");
    setFilterVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Search Header */}
      <View className="bg-white px-4 pt-3 pb-2 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <RNTextInput
            placeholder="Tìm theo khu vực, địa chỉ..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            className="flex-1 ml-2 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchText ? (
            <Pressable
              onPress={() => {
                setSearchText("");
                fetchPosts(1, true);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {/* Type Tabs */}
        <View className="flex-row mt-3">
          <Pressable
            onPress={() => setActiveType("SELL")}
            className={`flex-1 py-2 rounded-lg mr-1 ${activeType === "SELL" ? "bg-red-500" : "bg-gray-100"}`}
          >
            <Text
              className={`text-center font-semibold ${activeType === "SELL" ? "text-white" : "text-gray-600"}`}
            >
              Nhà đất bán
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveType("RENT")}
            className={`flex-1 py-2 rounded-lg ml-1 ${activeType === "RENT" ? "bg-red-500" : "bg-gray-100"}`}
          >
            <Text
              className={`text-center font-semibold ${activeType === "RENT" ? "text-white" : "text-gray-600"}`}
            >
              Nhà đất cho thuê
            </Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <View className="flex-row mt-2 pb-1">
          <Pressable
            onPress={() => setFilterVisible(true)}
            className="flex-row items-center bg-gray-100 rounded-lg px-3 py-1.5 mr-2"
          >
            <Ionicons name="filter" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">Bộ lọc</Text>
          </Pressable>
          {selectedCategory && (
            <Pressable
              onPress={() => setSelectedCategory(null)}
              className="bg-red-50 rounded-lg px-3 py-1.5 mr-2 flex-row items-center"
            >
              <Text className="text-red-600 text-sm">
                {categories.find((c) => c._id === selectedCategory)?.name ||
                  "Danh mục"}
              </Text>
              <Ionicons
                name="close"
                size={14}
                color="#DC2626"
                className="ml-1"
              />
            </Pressable>
          )}
          {selectedPrice && (
            <Pressable
              onPress={() => setSelectedPrice(null)}
              className="bg-red-50 rounded-lg px-3 py-1.5 mr-2 flex-row items-center"
            >
              <Text className="text-red-600 text-sm">
                {priceRanges.find((p) => p.value === selectedPrice)?.label ||
                  "Giá"}
              </Text>
              <Ionicons
                name="close"
                size={14}
                color="#DC2626"
                className="ml-1"
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Results */}
      <View className="flex-1 px-4 pt-3">
        <Text className="text-gray-500 text-sm mb-2">{meta.total} kết quả</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#DC2626" className="mt-10" />
        ) : posts.length === 0 ? (
          <View className="items-center mt-20">
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">
              Không tìm thấy kết quả
            </Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PostCard listing={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#DC2626"]}
              />
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#DC2626"
                  className="py-4"
                />
              ) : null
            }
          />
        )}
      </View>

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Bộ lọc nâng cao
          </Text>

          {/* Category */}
          <Text className="font-semibold text-gray-700 mb-2">Danh mục</Text>
          <View className="flex-row flex-wrap mb-4">
            {categories.map((cat) => (
              <Chip
                key={cat._id}
                selected={selectedCategory === cat._id}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat._id ? null : cat._id,
                  )
                }
                className="mr-2 mb-2"
                mode="outlined"
              >
                {cat.name}
              </Chip>
            ))}
          </View>

          {/* Price */}
          <Text className="font-semibold text-gray-700 mb-2">Khoảng giá</Text>
          <View className="flex-row flex-wrap mb-4">
            {priceRanges.map((range) => (
              <Chip
                key={range.value}
                selected={selectedPrice === range.value}
                onPress={() =>
                  setSelectedPrice(
                    selectedPrice === range.value ? null : range.value,
                  )
                }
                className="mr-2 mb-2"
                mode="outlined"
              >
                {range.label}
              </Chip>
            ))}
          </View>

          {/* Area */}
          <Text className="font-semibold text-gray-700 mb-2">Diện tích</Text>
          <View className="flex-row flex-wrap mb-4">
            {areaRanges.map((range) => (
              <Chip
                key={range.value}
                selected={selectedArea === range.value}
                onPress={() =>
                  setSelectedArea(
                    selectedArea === range.value ? null : range.value,
                  )
                }
                className="mr-2 mb-2"
                mode="outlined"
              >
                {range.label}
              </Chip>
            ))}
          </View>

          <View className="flex-row mt-2">
            <Button
              mode="outlined"
              onPress={clearFilters}
              className="flex-1 mr-2"
            >
              Xóa bộ lọc
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setFilterVisible(false);
                fetchPosts(1, true);
              }}
              buttonColor="#DC2626"
              className="flex-1 ml-2"
            >
              Áp dụng
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
