import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import {
  getOverallSummaryApi,
  getDashboardSummaryApi,
  getUserSummaryApi,
  getPostSummaryApi,
  getReportSummaryApi,
  getNewsSummaryApi,
  getSearchSummaryApi,
} from "@/services/summaryService";
import OverviewCards from "@/components/admin/OverviewCards";
import DetailedStats from "@/components/admin/DetailedStats";

const SW = Dimensions.get("window").width;
const CW = (SW - 52) / 2;

export default function AdminDashboard() {
  const [overall, setOverall] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [userSummary, setUserSummary] = useState<any>(null);
  const [postSummary, setPostSummary] = useState<any>(null);
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [newsSummary, setNewsSummary] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [oRes, dRes, uRes, pRes, rRes, nRes]: any[] = await Promise.all([
        getOverallSummaryApi(),
        getDashboardSummaryApi({ timeRange }),
        getUserSummaryApi(),
        getPostSummaryApi(),
        getReportSummaryApi(),
        getNewsSummaryApi(),
      ]);
      if (oRes?.status === 200) setOverall(oRes.data);
      if (dRes?.status === 200) setDashboard(dRes.data);
      if (uRes?.status === 200) setUserSummary(uRes.data);
      if (pRes?.status === 200) setPostSummary(pRes.data);
      if (rRes?.status === 200) setReportSummary(rRes.data);
      if (nRes?.status === 200) setNewsSummary(nRes.data);
    } catch (e) {
      console.log("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchResults(null);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res: any = await getSearchSummaryApi({
        searchTerm: searchQuery.trim(),
      });
      if (res?.status === 200) setSearchResults(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#F87171" />
        <Text className="text-gray-500 mt-3">Đang tải dữ liệu...</Text>
      </View>
    );

  const ra = dashboard?.recentActivity;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#F87171"
        />
      }
    >
      <View className="px-4 pt-4 pb-8">
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
            </Pressable>
            <View>
              <Text className="text-gray-900 text-xl font-bold">Dashboard</Text>
              <Text className="text-gray-500 text-sm">Tổng quan hệ thống</Text>
            </View>
          </View>
          <Pressable
            onPress={onRefresh}
            className="bg-white border border-gray-100 shadow-sm px-3 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="refresh" size={16} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1.5">Làm mới</Text>
          </Pressable>
        </View>

        <Searchbar
          placeholder="Tìm kiếm trong hệ thống..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          loading={searchLoading}
          inputStyle={{ color: "#111827" }}
          placeholderTextColor="#6B7280"
          iconColor="#9CA3AF"
          style={{
            marginBottom: 16,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#F3F4F6",
            elevation: 0,
            shadowOpacity: 0,
          }}
        />

        {searchResults && (
          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 font-bold">
                Kết quả: "{searchResults.searchTerm}"
              </Text>
              <Pressable
                onPress={() => {
                  setSearchResults(null);
                  setSearchQuery("");
                }}
              >
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              {[
                {
                  label: "Users",
                  value: searchResults.results?.users || 0,
                  color: "#3B82F6",
                },
                {
                  label: "Posts",
                  value: searchResults.results?.posts || 0,
                  color: "#10B981",
                },
                {
                  label: "News",
                  value: searchResults.results?.news || 0,
                  color: "#8B5CF6",
                },
                {
                  label: "Cats",
                  value: searchResults.results?.categories || 0,
                  color: "#F59E0B",
                },
              ].map((s) => (
                <View
                  key={s.label}
                  className="flex-1 items-center py-2 rounded-lg"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <Text
                    className="text-lg font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </Text>
                  <Text className="text-gray-500 text-xs">{s.label}</Text>
                </View>
              ))}
            </View>
            <View className="items-center mt-2">
              <Text className="text-gray-500 text-xs">
                Tổng: {searchResults.results?.total || 0} kết quả
              </Text>
            </View>
          </View>
        )}

        {/* Overview Cards */}
        <OverviewCards overall={overall} />

        {/* Recent Activity */}
        {ra && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 text-base font-bold">
                ⚡ Hoạt động gần đây
              </Text>
              <View className="flex-row bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                {[7, 30, 90].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setTimeRange(t)}
                    className={`px-3 py-1.5 ${timeRange === t ? "bg-red-600" : ""}`}
                  >
                    <Text
                      className={`text-xs ${timeRange === t ? "text-white font-semibold" : "text-gray-500"}`}
                    >
                      {t}D
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="flex-row gap-3">
              {[
                {
                  label: "User mới",
                  value: ra.newUsers,
                  icon: "person-add-outline",
                },
                {
                  label: "Post mới",
                  value: ra.newPosts,
                  icon: "add-circle-outline",
                },
                {
                  label: "Report mới",
                  value: ra.newReports,
                  icon: "warning-outline",
                },
              ].map((i) => (
                <View
                  key={i.label}
                  className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl p-3 items-center justify-center"
                >
                  <Ionicons name={i.icon as any} size={24} color="#4B5563" />
                  <Text className="text-2xl font-bold text-gray-900 mt-1">
                    {i.value}
                  </Text>
                  <Text className="text-gray-500 text-xs">{i.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {dashboard?.topPosts?.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-900 text-base font-bold mb-3">
              🏆 BĐS nổi bật
            </Text>
            {dashboard.topPosts.slice(0, 5).map((p: any, i: number) => (
              <Pressable
                key={p._id}
                onPress={() => router.push(`/property/${p._id}`)}
                className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 mb-2 flex-row items-center"
              >
                <View className="w-7 h-7 rounded bg-gray-200 items-center justify-center mr-3">
                  <Text className="text-gray-900 font-bold text-xs">
                    {i + 1}
                  </Text>
                </View>
                <View className="flex-1 mr-2">
                  <Text
                    className="text-gray-900 text-sm font-medium"
                    numberOfLines={1}
                  >
                    {p.title}
                  </Text>
                  <View className="flex-row items-center mt-1 gap-3">
                    <View className="flex-row items-center">
                      <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {p.views}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons
                        name="heart-outline"
                        size={12}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-500 text-xs ml-1">
                        {p.favorites}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  className={`px-2 py-0.5 rounded bg-gray-100`}
                >
                  <Text
                    className={`text-xs text-gray-700 font-medium`}
                  >
                    {p.type === "SELL" ? "Bán" : "Thuê"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Top Categories */}
        {dashboard?.topCategories?.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-900 text-base font-bold mb-3">
              📂 Danh mục phổ biến
            </Text>
            <View className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              {dashboard.topCategories.map((cat: any, i: number) => {
                const max = dashboard.topCategories[0]?.count || 1;
                const pct = Math.round((cat.count / max) * 100);
                return (
                  <View
                    key={cat._id}
                    className={`px-4 py-3 flex-row items-center ${i > 0 ? "border-t border-gray-200" : ""}`}
                  >
                    <Text className="text-gray-500 text-sm w-6">{i + 1}</Text>
                    <View className="flex-1 mx-3">
                      <Text className="text-gray-900 text-sm">{cat.name}</Text>
                      <View className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <View
                          className="h-full bg-gray-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-900 font-bold text-sm">
                        {cat.count}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {cat.totalViews} views
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <DetailedStats
          userSummary={userSummary}
          postSummary={postSummary}
          reportSummary={reportSummary}
          newsSummary={newsSummary}
          overall={overall}
        />

        <Text className="text-gray-900 text-base font-bold mt-6 mb-3">
          🔗 Quản lý nhanh
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-4">
          {[
            {
              icon: "people-outline",
              label: "Người dùng",
              route: "/(admin)/users",
            },
            {
              icon: "folder-outline",
              label: "Danh mục",
              route: "/(admin)/categories",
            },
            {
              icon: "document-text-outline",
              label: "Bài đăng",
              route: "/(admin)/posts",
            },
            {
              icon: "newspaper-outline",
              label: "Tin tức",
              route: "/(admin)/news",
            },
            {
              icon: "flag-outline",
              label: "Báo cáo",
              route: "/(admin)/reports",
            },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex-row items-center"
              style={{ width: CW }}
            >
              <Ionicons name={item.icon as any} size={20} color="#4B5563" />
              <Text className="text-gray-900 text-sm ml-2 font-medium flex-1">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#6B7280" />
            </Pressable>
          ))}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
