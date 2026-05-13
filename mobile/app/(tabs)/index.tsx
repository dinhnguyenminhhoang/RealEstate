import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { getHomeApi } from "@/services/homeService";
import { Post, Category, News } from "@/types";
import { getImageUrl } from "@/constants/config";
import { formatMoneyVND, formatTimeAgo } from "@/utils";

const { width } = Dimensions.get("window");
const FEATURED_CARD_WIDTH = Math.min(width * 0.78, 330);

type HomeStats = {
  totalPosts: number;
  rentPosts: number;
  sellPosts: number;
  totalCategories: number;
  totalNews: number;
};

type HomeData = {
  featuredPosts: Post[];
  latestPosts: Post[];
  categories: Category[];
  news: News[];
  stats: HomeStats;
};

const emptyStats: HomeStats = {
  totalPosts: 0,
  rentPosts: 0,
  sellPosts: 0,
  totalCategories: 0,
  totalNews: 0,
};

const categoryIcons = [
  "home-outline",
  "business-outline",
  "key-outline",
  "map-outline",
  "storefront-outline",
  "construct-outline",
] as const;

const getPostImage = (post: Post) =>
  post.images?.[0]?.path ? getImageUrl(post.images[0].path) : null;

const getCategoryName = (post: Post) =>
  typeof post.category === "object" ? post.category?.name : "";

const getAuthorName = (post: Post) =>
  typeof post.author === "object" ? post.author?.userName : "";

const formatStat = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return `${value}`;
};

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPress,
  inset = true,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPress?: () => void;
  inset?: boolean;
}) {
  return (
    <View style={[styles.sectionHeader, inset && styles.sectionHeaderInset]}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={15} color="#DC2626" />
        </Pressable>
      ) : null}
    </View>
  );
}

function ImageFallback({ large = false }: { large?: boolean }) {
  return (
    <View style={styles.imageFallback}>
      <Ionicons name="image-outline" size={large ? 42 : 30} color="#9CA3AF" />
    </View>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  const imageUrl = getPostImage(post);
  const categoryName = getCategoryName(post);

  return (
    <Pressable
      onPress={() => router.push(`/property/${post._id}`)}
      style={styles.featuredCard}
    >
      <View style={styles.featuredImageWrap}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.fill}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <ImageFallback large />
        )}
        <View style={styles.imageOverlay} />
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {post.type === "SELL" ? "Bán" : "Cho thuê"}
          </Text>
        </View>
        {categoryName ? (
          <View style={styles.categoryPillOnImage}>
            <Text style={styles.categoryPillText}>{categoryName}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.featuredPrice}>{formatMoneyVND(post.price)}</Text>

        <View style={styles.metaRow}>
          {post.acreage ? (
            <View style={styles.metaItem}>
              <Ionicons name="resize-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{post.acreage} m²</Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{post.views || 0}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{post.favorites || 0}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={15} color="#DC2626" />
          <Text style={styles.locationText} numberOfLines={1}>
            {post.address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function LatestPostCard({ post }: { post: Post }) {
  const imageUrl = getPostImage(post);
  const categoryName = getCategoryName(post);
  const authorName = getAuthorName(post);

  return (
    <Pressable
      onPress={() => router.push(`/property/${post._id}`)}
      style={styles.latestCard}
    >
      <View style={styles.latestImageWrap}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.fill}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <ImageFallback />
        )}
      </View>

      <View style={styles.latestBody}>
        <View style={styles.latestBadgeRow}>
          <View style={styles.softBadge}>
            <Text style={styles.softBadgeText}>
              {post.type === "SELL" ? "Bán" : "Cho thuê"}
            </Text>
          </View>
          {categoryName ? (
            <Text style={styles.latestCategory} numberOfLines={1}>
              {categoryName}
            </Text>
          ) : null}
        </View>

        <Text style={styles.latestTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.latestPrice}>{formatMoneyVND(post.price)}</Text>

        <View style={styles.latestInfoGrid}>
          {post.acreage ? (
            <View style={styles.compactMeta}>
              <Ionicons name="resize-outline" size={13} color="#6B7280" />
              <Text style={styles.compactMetaText}>{post.acreage} m²</Text>
            </View>
          ) : null}
          <View style={styles.compactMeta}>
            <Ionicons name="time-outline" size={13} color="#6B7280" />
            <Text style={styles.compactMetaText}>
              {post.createdAt ? formatTimeAgo(post.createdAt) : "Mới đăng"}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <Text style={styles.latestLocationText} numberOfLines={1}>
            {post.address}
          </Text>
        </View>

        <View style={styles.latestFooter}>
          <Text style={styles.authorText} numberOfLines={1}>
            {authorName || "Người đăng"}
          </Text>
          <View style={styles.latestCounters}>
            <Ionicons name="eye-outline" size={13} color="#9CA3AF" />
            <Text style={styles.counterText}>{post.views || 0}</Text>
            <Ionicons name="heart-outline" size={13} color="#9CA3AF" />
            <Text style={styles.counterText}>{post.favorites || 0}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function NewsCard({ item }: { item: News }) {
  return (
    <Pressable
      onPress={() => router.push(`/news/${item._id}`)}
      style={styles.newsCard}
    >
      <View style={styles.newsImageWrap}>
        {item.thumb ? (
          <Image
            source={{ uri: getImageUrl(item.thumb) }}
            style={styles.fill}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <ImageFallback />
        )}
      </View>

      <View style={styles.newsBody}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.tags?.length ? (
          <View style={styles.newsTags}>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.newsTag}>
                <Text style={styles.newsTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.newsTime}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={styles.newsTimeText}>
            {item.createdAt ? formatTimeAgo(item.createdAt) : "Gần đây"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [homeData, setHomeData] = useState<HomeData>({
    featuredPosts: [],
    latestPosts: [],
    categories: [],
    news: [],
    stats: emptyStats,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setErrorMessage("");
      const res: any = await getHomeApi({
        featuredLimit: 8,
        latestLimit: 8,
        categoryLimit: 10,
        newsLimit: 4,
      });

      if (res?.status === 200) {
        setHomeData({
          featuredPosts: res.data?.featuredPosts || [],
          latestPosts: res.data?.latestPosts || [],
          categories: res.data?.categories || [],
          news: res.data?.news || [],
          stats: res.data?.stats || emptyStats,
        });
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dữ liệu trang chủ",
      );
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

  const stats = useMemo(
    () => [
      {
        label: "Tin đang mở",
        value: formatStat(homeData.stats.totalPosts),
        icon: "home-outline" as const,
      },
      {
        label: "Cho thuê",
        value: formatStat(homeData.stats.rentPosts),
        icon: "key-outline" as const,
      },
      {
        label: "Rao bán",
        value: formatStat(homeData.stats.sellPosts),
        icon: "pricetag-outline" as const,
      },
    ],
    [homeData.stats],
  );

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Đang tải trang chủ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />
      <View style={styles.screen}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#DC2626"
              colors={["#DC2626"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.heroTitleWrap}>
                <Text style={styles.heroEyebrow}>BĐS Online</Text>
                <Text style={styles.heroTitle}>Tìm nơi phù hợp hôm nay</Text>
                <Text style={styles.heroSubtitle}>
                  Tin đã duyệt, thông tin rõ ràng, cập nhật liên tục.
                </Text>
              </View>
              <Pressable style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={21} color="#fff" />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              style={styles.searchBox}
            >
              <Ionicons name="search" size={22} color="#DC2626" />
              <Text style={styles.searchPlaceholder} numberOfLines={1}>
                Tìm theo khu vực, giá, loại nhà...
              </Text>
              <View style={styles.searchFilterIcon}>
                <Ionicons name="options-outline" size={18} color="#DC2626" />
              </View>
            </Pressable>

            <View style={styles.statsRow}>
              {stats.map((item) => (
                <View key={item.label} style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Ionicons name={item.icon} size={16} color="#DC2626" />
                  </View>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={28} color="#DC2626" />
              <Text style={styles.errorTitle}>Chưa tải được dữ liệu</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable onPress={fetchData} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </Pressable>
            </View>
          ) : null}

          {homeData.categories.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader
                title="Danh mục"
                subtitle={`${homeData.stats.totalCategories} loại bất động sản`}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              >
                {homeData.categories.map((category, index) => (
                  <Pressable
                    key={category._id}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/search",
                        params: { category: category._id },
                      })
                    }
                    style={styles.categoryCard}
                  >
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={categoryIcons[index % categoryIcons.length]}
                        size={24}
                        color="#DC2626"
                      />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={2}>
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {homeData.featuredPosts.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader
                title="BĐS nổi bật"
                subtitle="Được xem nhiều nhất"
                actionLabel="Xem tất cả"
                onPress={() => router.push("/(tabs)/search")}
              />
              <FlatList
                data={homeData.featuredPosts}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
                snapToInterval={FEATURED_CARD_WIDTH + 14}
                decelerationRate="fast"
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <FeaturedCard post={item} />}
              />
            </View>
          ) : null}

          {homeData.latestPosts.length > 0 ? (
            <View style={styles.sectionWithPadding}>
              <SectionHeader
                title="Tin đăng mới nhất"
                subtitle="Đầy đủ giá, diện tích và người đăng"
                actionLabel="Tất cả"
                inset={false}
                onPress={() => router.push("/(tabs)/search")}
              />
              <View style={styles.latestList}>
                {homeData.latestPosts.map((post) => (
                  <LatestPostCard key={post._id} post={post} />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="home-outline" size={30} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Chưa có tin đăng phù hợp</Text>
              <Text style={styles.emptyText}>
                Kéo xuống để làm mới hoặc quay lại sau ít phút.
              </Text>
            </View>
          )}

          {homeData.news.length > 0 ? (
            <View style={styles.sectionWithPadding}>
              <SectionHeader
                title="Tin tức & thị trường"
                subtitle={`${homeData.stats.totalNews} bài viết đang hiển thị`}
                actionLabel="Xem thêm"
                inset={false}
                onPress={() => router.push("/news")}
              />
              <View style={styles.newsList}>
                {homeData.news.map((item) => (
                  <NewsCard key={item._id} item={item} />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#B91C1C",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  fill: {
    width: "100%",
    height: "100%",
  },
  hero: {
    backgroundColor: "#B91C1C",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  heroTitleWrap: {
    flex: 1,
  },
  heroEyebrow: {
    color: "#FECACA",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "#FEE2E2",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FACC15",
    borderWidth: 1,
    borderColor: "#B91C1C",
  },
  searchBox: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    marginTop: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#450A0A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 5,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  searchFilterIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    justifyContent: "space-between",
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
  statValue: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },
  section: {
    marginTop: 24,
  },
  sectionWithPadding: {
    marginTop: 26,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionHeaderInset: {
    paddingHorizontal: 20,
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 2,
  },
  sectionActionText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900",
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 88,
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginBottom: 9,
  },
  categoryName: {
    color: "#374151",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    fontWeight: "800",
  },
  featuredList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  featuredImageWrap: {
    height: 190,
    backgroundColor: "#E5E7EB",
  },
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: "rgba(17,24,39,0.22)",
  },
  typeBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    backgroundColor: "#DC2626",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  categoryPillOnImage: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  categoryPillText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "900",
  },
  featuredBody: {
    padding: 14,
  },
  featuredTitle: {
    color: "#111827",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
  },
  featuredPrice: {
    color: "#DC2626",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 7,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 9,
  },
  locationText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "700",
  },
  latestList: {
    gap: 14,
  },
  latestCard: {
    flexDirection: "row",
    height: 168,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 13,
    elevation: 2,
  },
  latestImageWrap: {
    width: 126,
    height: 168,
    backgroundColor: "#E5E7EB",
  },
  latestBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  latestBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  softBadge: {
    backgroundColor: "#FEF2F2",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  softBadgeText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "900",
  },
  latestCategory: {
    flex: 1,
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
  },
  latestTitle: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
    marginTop: 6,
  },
  latestPrice: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },
  latestInfoGrid: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compactMetaText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },
  latestLocationText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  latestFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  authorText: {
    flex: 1,
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
  },
  latestCounters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  counterText: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "800",
    marginRight: 4,
  },
  newsList: {
    gap: 12,
  },
  newsCard: {
    flexDirection: "row",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 10,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  newsImageWrap: {
    width: 104,
    height: 82,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  newsBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  newsTitle: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  newsTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 7,
  },
  newsTag: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  newsTagText: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
  },
  newsTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },
  newsTimeText: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "700",
  },
  errorCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: 18,
    alignItems: "center",
  },
  errorTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },
  errorText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 5,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 20,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },
});
