import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import PostCard from "@/components/PostCard";
import { getAllCategoryApi } from "@/services/categoryService";
import { getAllPostApi } from "@/services/postService";
import { Category, PaginationMeta, Post, PostFilters } from "@/types";
import { areaRanges, priceRanges, postTypeOptions } from "@/utils/enum";

type PostType = "SELL" | "RENT";

type SearchFilters = {
  type: PostType;
  category: string | null;
  price: string | null;
  area: string | null;
  address: string;
  sort: string;
};

const DEFAULT_FILTERS: SearchFilters = {
  type: "SELL",
  category: null,
  price: null,
  area: null,
  address: "",
  sort: "createdAt-desc",
};

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Mới nhất", icon: "time-outline" },
  { value: "price-asc", label: "Giá thấp", icon: "trending-down-outline" },
  { value: "price-desc", label: "Giá cao", icon: "trending-up-outline" },
  { value: "views-desc", label: "Xem nhiều", icon: "eye-outline" },
] as const;

const RENT_PRICE_RANGES = [
  { value: "0-0.005", label: "Dưới 5 triệu" },
  { value: "0.005-0.01", label: "5 - 10 triệu" },
  { value: "0.01-0.02", label: "10 - 20 triệu" },
  { value: "0.02-0.05", label: "20 - 50 triệu" },
  { value: "0.05-0.1", label: "50 - 100 triệu" },
  { value: "0.1-100000", label: "Trên 100 triệu" },
] as const;

const emptyMeta: PaginationMeta = {
  total: 0,
  limit: 10,
  page: 1,
  totalPages: 1,
};

const buildApiFilters = (filters: SearchFilters): PostFilters => {
  const apiFilters: PostFilters = {
    type: filters.type,
    sort: filters.sort,
  };

  if (filters.category) apiFilters.category = filters.category;
  if (filters.price) apiFilters.price = filters.price;
  if (filters.area) apiFilters.area = filters.area;
  if (filters.address.trim()) apiFilters.address = filters.address.trim();

  return apiFilters;
};

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta);
  const [errorMessage, setErrorMessage] = useState("");

  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    category: params.category || null,
  });
  const [draftFilters, setDraftFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    category: params.category || null,
  });
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const selectedCategoryName = useMemo(
    () =>
      categories.find((category) => category._id === appliedFilters.category)
        ?.name || "",
    [appliedFilters.category, categories],
  );

  const appliedPriceRanges = useMemo(
    () => (appliedFilters.type === "RENT" ? RENT_PRICE_RANGES : priceRanges),
    [appliedFilters.type],
  );

  const draftPriceRanges = useMemo(
    () => (draftFilters.type === "RENT" ? RENT_PRICE_RANGES : priceRanges),
    [draftFilters.type],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.category) count += 1;
    if (appliedFilters.price) count += 1;
    if (appliedFilters.area) count += 1;
    if (appliedFilters.address.trim()) count += 1;
    if (appliedFilters.sort !== DEFAULT_FILTERS.sort) count += 1;
    return count;
  }, [appliedFilters]);

  const fetchPosts = useCallback(
    async (page = 1, filters = appliedFilters) => {
      try {
        setErrorMessage("");
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const res: any = await getAllPostApi({
          page,
          limit: 10,
          filters: buildApiFilters(filters),
        });

        if (res?.status === 200) {
          const newData = res.data?.data || [];
          setPosts((prev) => (page === 1 ? newData : [...prev, ...newData]));
          setMeta(res.data?.meta || emptyMeta);
        }
      } catch (error: any) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tải danh sách bài đăng",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [appliedFilters],
  );

  useEffect(() => {
    fetchPosts(1, appliedFilters);
  }, [appliedFilters, fetchPosts]);

  useEffect(() => {
    getAllCategoryApi({ page: 1, limit: 50 }).then((res: any) => {
      if (res?.status === 200) setCategories(res.data?.data || []);
    });
  }, []);

  useEffect(() => {
    if (params.category && params.category !== appliedFilters.category) {
      setAppliedFilters((prev) => ({ ...prev, category: params.category || null }));
      setDraftFilters((prev) => ({ ...prev, category: params.category || null }));
    }
  }, [appliedFilters.category, params.category]);

  const openFilter = () => {
    setDraftFilters(appliedFilters);
    setFilterVisible(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(1, appliedFilters);
    setRefreshing(false);
  }, [appliedFilters, fetchPosts]);

  const loadMore = () => {
    if (!loading && !loadingMore && meta.page < meta.totalPages) {
      fetchPosts(meta.page + 1, appliedFilters);
    }
  };

  const applySearch = () => {
    Keyboard.dismiss();
    setAppliedFilters((prev) => ({ ...prev, address: searchText.trim() }));
  };

  const clearSearch = () => {
    setSearchText("");
    setAppliedFilters((prev) => ({ ...prev, address: "" }));
  };

  const clearAllFilters = () => {
    const nextFilters = {
      ...DEFAULT_FILTERS,
      type: appliedFilters.type,
    };
    setSearchText("");
    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setFilterVisible(false);
  };

  const applyDraftFilters = () => {
    setSearchText(draftFilters.address);
    setAppliedFilters(draftFilters);
    setFilterVisible(false);
  };

  const setType = (type: PostType) => {
    setAppliedFilters((prev) => ({ ...prev, type, price: null }));
    setDraftFilters((prev) => ({ ...prev, type, price: null }));
  };

  const removeAppliedFilter = (key: keyof SearchFilters) => {
    const value = key === "sort" ? DEFAULT_FILTERS.sort : key === "address" ? "" : null;
    setAppliedFilters((prev) => ({ ...prev, [key]: value }));
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "address") setSearchText("");
  };

  const renderFilterChip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[styles.optionChip, active && styles.optionChipActive]}
    >
      <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>
        {label}
      </Text>
      {active ? <Ionicons name="checkmark" size={14} color="#DC2626" /> : null}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              placeholder="Tìm theo khu vực, địa chỉ..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={applySearch}
              returnKeyType="search"
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
            {searchText ? (
              <Pressable onPress={clearSearch} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={openFilter} style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color="#DC2626" />
            {activeFilterCount > 0 ? (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.typeTabs}>
          {postTypeOptions.map((type) => (
            <Pressable
              key={type.value}
              onPress={() => setType(type.value as PostType)}
              style={[
                styles.typeTab,
                appliedFilters.type === type.value && styles.typeTabActive,
              ]}
            >
              <Text
                style={[
                  styles.typeTabText,
                  appliedFilters.type === type.value && styles.typeTabTextActive,
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.appliedChips}
        >
          <Pressable onPress={openFilter} style={styles.appliedChipNeutral}>
            <Ionicons name="filter-outline" size={14} color="#4B5563" />
            <Text style={styles.appliedChipNeutralText}>Bộ lọc</Text>
          </Pressable>

          {appliedFilters.category ? (
            <Pressable
              onPress={() => removeAppliedFilter("category")}
              style={styles.appliedChip}
            >
              <Text style={styles.appliedChipText}>
                {selectedCategoryName || "Danh mục"}
              </Text>
              <Ionicons name="close" size={14} color="#DC2626" />
            </Pressable>
          ) : null}

          {appliedFilters.price ? (
            <Pressable
              onPress={() => removeAppliedFilter("price")}
              style={styles.appliedChip}
            >
              <Text style={styles.appliedChipText}>
                {appliedPriceRanges.find(
                  (item) => item.value === appliedFilters.price,
                )?.label || "Giá"}
              </Text>
              <Ionicons name="close" size={14} color="#DC2626" />
            </Pressable>
          ) : null}

          {appliedFilters.area ? (
            <Pressable
              onPress={() => removeAppliedFilter("area")}
              style={styles.appliedChip}
            >
              <Text style={styles.appliedChipText}>
                {areaRanges.find((item) => item.value === appliedFilters.area)
                  ?.label || "Diện tích"}
              </Text>
              <Ionicons name="close" size={14} color="#DC2626" />
            </Pressable>
          ) : null}

          {appliedFilters.address ? (
            <Pressable
              onPress={() => removeAppliedFilter("address")}
              style={styles.appliedChip}
            >
              <Text style={styles.appliedChipText}>{appliedFilters.address}</Text>
              <Ionicons name="close" size={14} color="#DC2626" />
            </Pressable>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.resultCount}>{meta.total} kết quả</Text>
          <Text style={styles.resultHint}>
            {appliedFilters.type === "SELL" ? "Nhà đất bán" : "Nhà đất cho thuê"}
          </Text>
        </View>
        <Pressable onPress={openFilter} style={styles.sortButton}>
          <Ionicons name="swap-vertical-outline" size={16} color="#DC2626" />
          <Text style={styles.sortButtonText}>
            {SORT_OPTIONS.find((item) => item.value === appliedFilters.sort)
              ?.label || "Sắp xếp"}
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Đang tải kết quả...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="alert-circle-outline" size={58} color="#FCA5A5" />
          <Text style={styles.emptyTitle}>Không tải được dữ liệu</Text>
          <Text style={styles.emptyText}>{errorMessage}</Text>
          <Button
            mode="contained"
            onPress={() => fetchPosts(1, appliedFilters)}
            buttonColor="#DC2626"
            style={styles.emptyButton}
          >
            Thử lại
          </Button>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptyText}>
            Thử đổi khu vực, khoảng giá hoặc diện tích.
          </Text>
          <Button
            mode="outlined"
            onPress={clearAllFilters}
            textColor="#DC2626"
            style={styles.emptyButton}
          >
            Xóa bộ lọc
          </Button>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard listing={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.45}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#DC2626"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#DC2626" />
              </View>
            ) : null
          }
        />
      )}

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setFilterVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setFilterVisible(false)}
          />
          <View style={styles.filterSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Bộ lọc</Text>
                <Text style={styles.sheetSubtitle}>Tinh chỉnh kết quả tìm kiếm</Text>
              </View>
              <Pressable
                onPress={() => setFilterVisible(false)}
                style={styles.sheetCloseButton}
              >
                <Ionicons name="close" size={22} color="#4B5563" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Loại giao dịch</Text>
                <View style={styles.segmented}>
                  {postTypeOptions.map((type) => (
                    <Pressable
                      key={type.value}
                      onPress={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          type: type.value as PostType,
                          price:
                            prev.type === type.value ? prev.price : null,
                        }))
                      }
                      style={[
                        styles.segmentItem,
                        draftFilters.type === type.value && styles.segmentItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          draftFilters.type === type.value &&
                            styles.segmentTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Khu vực / địa chỉ</Text>
                <View style={styles.modalSearchBox}>
                  <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                  <RNTextInput
                    value={draftFilters.address}
                    onChangeText={(value) =>
                      setDraftFilters((prev) => ({ ...prev, address: value }))
                    }
                    placeholder="Ví dụ: Quận 1, Hà Nội..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.modalSearchInput}
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Danh mục</Text>
                <View style={styles.optionGrid}>
                  {categories.map((category) =>
                    renderFilterChip({
                      label: category.name,
                      active: draftFilters.category === category._id,
                      onPress: () =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          category:
                            prev.category === category._id ? null : category._id,
                        })),
                    }),
                  )}
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Khoảng giá</Text>
                <View style={styles.optionGrid}>
                  {draftPriceRanges.map((range) =>
                    renderFilterChip({
                      label: range.label,
                      active: draftFilters.price === range.value,
                      onPress: () =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          price: prev.price === range.value ? null : range.value,
                        })),
                    }),
                  )}
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Diện tích</Text>
                <View style={styles.optionGrid}>
                  {areaRanges.map((range) =>
                    renderFilterChip({
                      label: range.label,
                      active: draftFilters.area === range.value,
                      onPress: () =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          area: prev.area === range.value ? null : range.value,
                        })),
                    }),
                  )}
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Sắp xếp</Text>
                <View style={styles.sortGrid}>
                  {SORT_OPTIONS.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sort: option.value,
                        }))
                      }
                      style={[
                        styles.sortOption,
                        draftFilters.sort === option.value &&
                          styles.sortOptionActive,
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={18}
                        color={
                          draftFilters.sort === option.value
                            ? "#DC2626"
                            : "#6B7280"
                        }
                      />
                      <Text
                        style={[
                          styles.sortOptionText,
                          draftFilters.sort === option.value &&
                            styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.sheetActions}>
              <Button
                mode="outlined"
                onPress={clearAllFilters}
                textColor="#DC2626"
                style={styles.sheetActionButton}
                contentStyle={styles.sheetActionContent}
              >
                Xóa lọc
              </Button>
              <Button
                mode="contained"
                onPress={applyDraftFilters}
                buttonColor="#DC2626"
                textColor="#FFFFFF"
                style={styles.sheetActionButton}
                contentStyle={styles.sheetActionContent}
                labelStyle={styles.sheetApplyLabel}
              >
                Áp dụng
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  filterCountBadge: {
    position: "absolute",
    right: 7,
    top: 6,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    paddingHorizontal: 4,
  },
  filterCountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  typeTabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    minHeight: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  typeTabActive: {
    backgroundColor: "#DC2626",
  },
  typeTabText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "800",
  },
  typeTabTextActive: {
    color: "#FFFFFF",
  },
  appliedChips: {
    gap: 8,
    paddingTop: 10,
    paddingRight: 8,
  },
  appliedChipNeutral: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
  },
  appliedChipNeutralText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "800",
  },
  appliedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  appliedChipText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "900",
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  resultCount: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  resultHint: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  sortButtonText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "900",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#6B7280",
    marginTop: 10,
    fontWeight: "700",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 6,
  },
  emptyButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  footerLoading: {
    paddingVertical: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17,24,39,0.46)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  filterSheet: {
    maxHeight: "88%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    overflow: "hidden",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
  },
  sheetSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  sheetCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  filterBlock: {
    marginBottom: 20,
  },
  filterLabel: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },
  segmented: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F3F4F6",
    padding: 4,
    borderRadius: 16,
  },
  segmentItem: {
    flex: 1,
    minHeight: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemActive: {
    backgroundColor: "#DC2626",
  },
  segmentText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  modalSearchBox: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    minHeight: 38,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionChipActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  optionChipText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "800",
  },
  optionChipTextActive: {
    color: "#DC2626",
    fontWeight: "900",
  },
  sortGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortOption: {
    width: "48%",
    minHeight: 48,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sortOptionActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  sortOptionText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "800",
  },
  sortOptionTextActive: {
    color: "#DC2626",
    fontWeight: "900",
  },
  sheetActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  sheetActionButton: {
    flex: 1,
    borderRadius: 14,
  },
  sheetActionContent: {
    paddingVertical: 6,
  },
  sheetApplyLabel: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
