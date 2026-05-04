import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import {
  getOverallSummaryApi, getDashboardSummaryApi, getUserSummaryApi,
  getPostSummaryApi, getReportSummaryApi, getNewsSummaryApi, getSearchSummaryApi,
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
    } catch (e) { console.log("Dashboard load error:", e); }
    finally { setLoading(false); }
  }, [timeRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); setSearchResults(null); await fetchData(); setRefreshing(false);
  }, [fetchData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res: any = await getSearchSummaryApi({ searchTerm: searchQuery.trim() });
      if (res?.status === 200) setSearchResults(res.data);
    } catch (e) { console.log(e); }
    finally { setSearchLoading(false); }
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#F87171" />
      <Text className="text-gray-400 mt-3">Đang tải dữ liệu...</Text>
    </View>
  );

  const ra = dashboard?.recentActivity;

  return (
    <ScrollView className="flex-1 bg-gray-900" showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F87171" />}>
      <View className="px-4 pt-4 pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-white text-xl font-bold">Dashboard</Text>
            <Text className="text-gray-400 text-sm">Tổng quan hệ thống</Text>
          </View>
          <Pressable onPress={onRefresh} className="bg-gray-800 px-3 py-2 rounded-lg flex-row items-center">
            <Ionicons name="refresh" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1.5">Làm mới</Text>
          </Pressable>
        </View>

        {/* Search */}
        <Searchbar placeholder="Tìm kiếm trong hệ thống..." value={searchQuery}
          onChangeText={setSearchQuery} onSubmitEditing={handleSearch} loading={searchLoading}
          className="mb-4 bg-gray-800" inputStyle={{ color: "white" }}
          placeholderTextColor="#6B7280" iconColor="#9CA3AF" style={{ elevation: 0 }} />

        {/* Search Results */}
        {searchResults && (
          <View className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold">Kết quả: "{searchResults.searchTerm}"</Text>
              <Pressable onPress={() => { setSearchResults(null); setSearchQuery(""); }}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              {[
                { label: "Users", value: searchResults.results?.users || 0, color: "#3B82F6" },
                { label: "Posts", value: searchResults.results?.posts || 0, color: "#10B981" },
                { label: "News", value: searchResults.results?.news || 0, color: "#8B5CF6" },
                { label: "Cats", value: searchResults.results?.categories || 0, color: "#F59E0B" },
              ].map((s) => (
                <View key={s.label} className="flex-1 items-center py-2 rounded-lg" style={{ backgroundColor: `${s.color}15` }}>
                  <Text className="text-lg font-bold" style={{ color: s.color }}>{s.value}</Text>
                  <Text className="text-gray-400 text-xs">{s.label}</Text>
                </View>
              ))}
            </View>
            <View className="items-center mt-2">
              <Text className="text-gray-500 text-xs">Tổng: {searchResults.results?.total || 0} kết quả</Text>
            </View>
          </View>
        )}

        {/* Overview Cards */}
        <OverviewCards overall={overall} />

        {/* Recent Activity */}
        {ra && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-base font-bold">⚡ Hoạt động gần đây</Text>
              <View className="flex-row bg-gray-800 rounded-lg overflow-hidden">
                {[7, 30, 90].map((t) => (
                  <Pressable key={t} onPress={() => setTimeRange(t)}
                    className={`px-3 py-1.5 ${timeRange === t ? "bg-red-600" : ""}`}>
                    <Text className={`text-xs ${timeRange === t ? "text-white font-semibold" : "text-gray-400"}`}>{t}D</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="flex-row gap-3">
              {[
                { label: "User mới", value: ra.newUsers, icon: "person-add", color: "#3B82F6", bg: "#172554" },
                { label: "Post mới", value: ra.newPosts, icon: "add-circle", color: "#10B981", bg: "#14532D" },
                { label: "Report mới", value: ra.newReports, icon: "warning", color: "#EF4444", bg: "#450A0A" },
              ].map((i) => (
                <View key={i.label} className="flex-1 rounded-xl p-3" style={{ backgroundColor: i.bg }}>
                  <Ionicons name={i.icon as any} size={20} color={i.color} />
                  <Text className="text-2xl font-bold text-white mt-1">{i.value}</Text>
                  <Text className="text-gray-400 text-xs">{i.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Posts */}
        {dashboard?.topPosts?.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-base font-bold mb-3">🏆 BĐS nổi bật</Text>
            {dashboard.topPosts.slice(0, 5).map((p: any, i: number) => (
              <Pressable key={p._id} onPress={() => router.push(`/property/${p._id}`)}
                className="bg-gray-800 rounded-xl p-3 mb-2 flex-row items-center">
                <View className="w-7 h-7 rounded bg-gray-700 items-center justify-center mr-3">
                  <Text className="text-white font-bold text-xs">{i + 1}</Text>
                </View>
                <View className="flex-1 mr-2">
                  <Text className="text-white text-sm font-medium" numberOfLines={1}>{p.title}</Text>
                  <View className="flex-row items-center mt-1 gap-3">
                    <View className="flex-row items-center">
                      <Ionicons name="eye-outline" size={12} color="#60A5FA" />
                      <Text className="text-blue-400 text-xs ml-1">{p.views}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="heart-outline" size={12} color="#F87171" />
                      <Text className="text-red-400 text-xs ml-1">{p.favorites}</Text>
                    </View>
                  </View>
                </View>
                <View className={`px-2 py-0.5 rounded ${p.type === "SELL" ? "bg-green-900" : "bg-blue-900"}`}>
                  <Text className={`text-xs ${p.type === "SELL" ? "text-green-400" : "text-blue-400"}`}>
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
            <Text className="text-white text-base font-bold mb-3">📂 Danh mục phổ biến</Text>
            <View className="bg-gray-800 rounded-xl overflow-hidden">
              {dashboard.topCategories.map((cat: any, i: number) => {
                const max = dashboard.topCategories[0]?.count || 1;
                const pct = Math.round((cat.count / max) * 100);
                return (
                  <View key={cat._id} className={`px-4 py-3 flex-row items-center ${i > 0 ? "border-t border-gray-700" : ""}`}>
                    <Text className="text-gray-400 text-sm w-6">{i + 1}</Text>
                    <View className="flex-1 mx-3">
                      <Text className="text-white text-sm">{cat.name}</Text>
                      <View className="h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <View className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-white font-bold text-sm">{cat.count}</Text>
                      <Text className="text-gray-500 text-xs">{cat.totalViews} views</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Detailed Analytics (from 4 additional APIs) */}
        <DetailedStats
          userSummary={userSummary}
          postSummary={postSummary}
          reportSummary={reportSummary}
          newsSummary={newsSummary}
          overall={overall}
        />

        {/* Quick Links */}
        <Text className="text-white text-base font-bold mt-6 mb-3">🔗 Quản lý nhanh</Text>
        <View className="flex-row flex-wrap gap-3 mb-4">
          {[
            { icon: "people", label: "Người dùng", route: "/(admin)/users", color: "#3B82F6" },
            { icon: "folder", label: "Danh mục", route: "/(admin)/categories", color: "#EC4899" },
            { icon: "document-text", label: "Bài đăng", route: "/(admin)/posts", color: "#10B981" },
            { icon: "newspaper", label: "Tin tức", route: "/(admin)/news", color: "#8B5CF6" },
            { icon: "flag", label: "Báo cáo", route: "/(admin)/reports", color: "#EF4444" },
          ].map((item) => (
            <Pressable key={item.label} onPress={() => router.push(item.route as any)}
              className="bg-gray-800 rounded-xl p-3 flex-row items-center" style={{ width: CW }}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text className="text-gray-300 text-sm ml-2 font-medium flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color="#6B7280" />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
