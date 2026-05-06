import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  TextInput as RNTextInput,
  Modal,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  getAllReportApi,
  updateStatusReportApi,
} from "@/services/reportService";
import { useNotification } from "@/hooks/useNotification";
import { Report, Post, User } from "@/types";
import { formatTimeAgo } from "@/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  pending: {
    label: "Chờ xử lý",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: "time-outline",
  },
  resolved: {
    label: "Đã xử lý",
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: "checkmark-circle-outline",
  },
  rejected: {
    label: "Từ chối",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: "close-circle-outline",
  },
};

export default function AdminReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { showSuccess, handleError } = useNotification();

  const [actionModal, setActionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res: any = await getAllReportApi({ page: 1, limit: 100 });
      if (res?.status === 200) setReports(res.data?.data || []);
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

  const handleUpdateStatus = async (status: string) => {
    if (!selectedReport) return;
    try {
      await updateStatusReportApi({ status }, selectedReport._id);
      showSuccess(`Cập nhật: ${STATUS_CONFIG[status]?.label}`);
      setActionModal(false);
      fetchData();
    } catch (e) {
      handleError(e);
    }
  };

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      search === "" ||
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      (r.content && r.content.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2 z-10">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
            </Pressable>
            <View>
              <Text className="text-gray-900 text-xl font-bold">Báo cáo</Text>
              <Text className="text-gray-500 text-sm">Quản lý vi phạm</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center gap-2 mb-4">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              className="flex-1 ml-2 text-gray-900 text-sm h-full"
              placeholder="Tìm theo lý do, nội dung..."
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
        </View>

        {/* Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row gap-2 pr-4">
            <Pressable
              onPress={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-full border ${
                statusFilter === "all"
                  ? "bg-gray-900 border-gray-900"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  statusFilter === "all" ? "text-white" : "text-gray-600"
                }`}
              >
                Tất cả ({reports.length})
              </Text>
            </Pressable>
            
            {[
              { id: "pending", label: `Chờ xử lý (${pendingCount})`, color: "#D97706", bg: "#FFFBEB" },
              { id: "resolved", label: `Đã xử lý (${resolvedCount})`, color: "#16A34A", bg: "#F0FDF4" },
              { id: "rejected", label: `Từ chối (${rejectedCount})`, color: "#DC2626", bg: "#FEF2F2" },
            ].map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-full border flex-row items-center ${
                  statusFilter === f.id
                    ? "bg-gray-900 border-gray-900"
                    : "bg-white border-gray-200"
                }`}
              >
                <View 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: statusFilter === f.id ? "white" : f.color }} 
                />
                <Text
                  className={`text-sm font-semibold ${
                    statusFilter === f.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
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
            <Ionicons name="flag-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">Không có báo cáo nào</Text>
          </View>
        }
        renderItem={({ item }) => {
          const postTitle =
            typeof item.post === "object"
              ? (item.post as Post).title
              : "Bài đăng";
          const postId =
            typeof item.post === "object" ? (item.post as Post)._id : item.post;
          const authorName =
            typeof item.author === "object"
              ? (item.author as User).userName
              : "Người dùng";
          const st = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

          return (
            <Pressable
              onPress={() => {
                setSelectedReport(item);
                setActionModal(true);
              }}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              {/* Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <Pressable onPress={() => router.push(`/property/${postId}`)}>
                    <Text
                      className="font-bold text-gray-900 text-base"
                      numberOfLines={2}
                    >
                      {postTitle}
                    </Text>
                  </Pressable>
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons name="person-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-1">
                      Người báo cáo: {authorName}
                    </Text>
                  </View>
                </View>
                <View
                  className="flex-row items-center px-2.5 py-1 rounded-full border border-gray-100"
                  style={{ backgroundColor: st.bg }}
                >
                  <Ionicons name={st.icon as any} size={12} color={st.color} />
                  <Text
                    className="text-xs font-bold ml-1"
                    style={{ color: st.color }}
                  >
                    {st.label}
                  </Text>
                </View>
              </View>

              {/* Reason */}
              <View className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color="#DC2626"
                  />
                  <Text className="text-gray-900 font-bold text-sm ml-1.5">
                    Lý do: {item.reason}
                  </Text>
                </View>
                {item.content && (
                  <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                    {item.content}
                  </Text>
                )}
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between">
                {item.createdAt && (
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1">
                      {formatTimeAgo(item.createdAt)}
                    </Text>
                  </View>
                )}
                {item.status === "pending" ? (
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedReport(item);
                        handleUpdateStatus("resolved");
                      }}
                      className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg flex-row items-center"
                    >
                      <Ionicons name="checkmark" size={14} color="#16A34A" />
                      <Text className="text-green-600 text-xs ml-1 font-bold">
                        Đã xử lý
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedReport(item);
                        handleUpdateStatus("rejected");
                      }}
                      className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex-row items-center"
                    >
                      <Ionicons name="close" size={14} color="#DC2626" />
                      <Text className="text-red-600 text-xs ml-1 font-bold">
                        Từ chối
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      setSelectedReport(item);
                      setActionModal(true);
                    }}
                    className="bg-gray-100 px-3 py-1.5 rounded-lg flex-row items-center"
                  >
                    <Text className="text-gray-600 text-xs font-semibold">
                      Xem chi tiết
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          );
        }}
      />

      {/* Detail Modal (Bottom Sheet style) */}
      <Modal
        visible={actionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActionModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl min-h-[60%] max-h-[90%] pb-8">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <Text className="text-xl font-bold text-gray-900">Chi tiết báo cáo</Text>
              <Pressable
                onPress={() => setActionModal(false)}
                className="p-1.5 bg-gray-100 rounded-full"
              >
                <Ionicons name="close" size={20} color="#4B5563" />
              </Pressable>
            </View>

            {selectedReport && (
              <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
                <View className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="warning" size={20} color="#DC2626" />
                    <Text className="text-red-700 font-bold text-base ml-2">
                      Lý do: {selectedReport.reason}
                    </Text>
                  </View>
                  {selectedReport.content && (
                    <Text className="text-gray-700 text-sm mt-1 leading-5">
                      {selectedReport.content}
                    </Text>
                  )}
                </View>

                <View className="mb-6">
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                    <Text className="text-gray-500 font-medium">Trạng thái hiện tại</Text>
                    <View
                      className="flex-row items-center px-3 py-1 rounded-full border border-gray-100"
                      style={{ backgroundColor: STATUS_CONFIG[selectedReport.status]?.bg || "#FFFBEB" }}
                    >
                      <Ionicons name={STATUS_CONFIG[selectedReport.status]?.icon as any || "time-outline"} size={14} color={STATUS_CONFIG[selectedReport.status]?.color || "#D97706"} />
                      <Text
                        className="text-sm font-bold ml-1.5"
                        style={{ color: STATUS_CONFIG[selectedReport.status]?.color || "#D97706" }}
                      >
                        {STATUS_CONFIG[selectedReport.status]?.label || "Chờ xử lý"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                    <Text className="text-gray-500 font-medium">Người báo cáo</Text>
                    <Text className="text-gray-900 font-semibold">
                      {typeof selectedReport.author === "object"
                        ? (selectedReport.author as User).userName
                        : "Khách"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                    <Text className="text-gray-500 font-medium">Thời gian gửi</Text>
                    <Text className="text-gray-900 font-semibold">
                      {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                    </Text>
                  </View>
                </View>

                {selectedReport.status === "pending" && (
                  <View className="gap-3">
                    <Pressable
                      onPress={() => handleUpdateStatus("resolved")}
                      className="bg-green-600 py-3.5 rounded-xl flex-row items-center justify-center shadow-sm"
                    >
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                      <Text className="text-white text-base font-bold ml-2">Đánh dấu Đã xử lý</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleUpdateStatus("rejected")}
                      className="bg-red-50 border border-red-200 py-3.5 rounded-xl flex-row items-center justify-center"
                    >
                      <Ionicons name="close-circle" size={20} color="#DC2626" />
                      <Text className="text-red-600 text-base font-bold ml-2">Từ chối báo cáo</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
