import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Modal, Portal, SegmentedButtons } from "react-native-paper";
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

  const filtered =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Stats */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row gap-2 mb-3">
          {[
            {
              label: "Chờ xử lý",
              count: pendingCount,
              color: "#D97706",
              bg: "#FFFBEB",
            },
            {
              label: "Đã xử lý",
              count: resolvedCount,
              color: "#16A34A",
              bg: "#F0FDF4",
            },
            {
              label: "Từ chối",
              count: rejectedCount,
              color: "#DC2626",
              bg: "#FEF2F2",
            },
          ].map((s) => (
            <View
              key={s.label}
              className="flex-1 rounded-xl p-3 items-center"
              style={{ backgroundColor: s.bg }}
            >
              <Text className="text-2xl font-bold" style={{ color: s.color }}>
                {s.count}
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: s.color }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Filter tabs */}
        <View className="flex-row bg-white rounded-xl overflow-hidden">
          {[
            { value: "all", label: `Tất cả (${reports.length})` },
            { value: "pending", label: `Chờ (${pendingCount})` },
            { value: "resolved", label: `Xong (${resolvedCount})` },
          ].map((tab) => (
            <Pressable
              key={tab.value}
              onPress={() => setStatusFilter(tab.value)}
              className={`flex-1 py-2.5 items-center ${statusFilter === tab.value ? "bg-red-500" : ""}`}
            >
              <Text
                className={`text-xs font-semibold ${statusFilter === tab.value ? "text-white" : "text-gray-500"}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
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
            <Text className="text-gray-400 text-lg mt-4">Không có báo cáo</Text>
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
              className="bg-white rounded-xl p-4 mb-2.5 shadow-sm"
            >
              {/* Header */}
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Pressable onPress={() => router.push(`/property/${postId}`)}>
                    <Text
                      className="font-bold text-gray-900 text-base"
                      numberOfLines={1}
                    >
                      {postTitle}
                    </Text>
                  </Pressable>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="person-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-1">
                      Báo cáo bởi: {authorName}
                    </Text>
                  </View>
                </View>
                <View
                  className="flex-row items-center px-2 py-1 rounded-full"
                  style={{ backgroundColor: st.bg }}
                >
                  <Ionicons name={st.icon as any} size={12} color={st.color} />
                  <Text
                    className="text-xs font-semibold ml-1"
                    style={{ color: st.color }}
                  >
                    {st.label}
                  </Text>
                </View>
              </View>

              {/* Reason */}
              <View className="bg-gray-50 rounded-lg p-3 mb-2">
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#6B7280"
                  />
                  <Text className="text-gray-700 font-medium text-sm ml-1">
                    Lý do: {item.reason}
                  </Text>
                </View>
                {item.content && (
                  <Text className="text-gray-500 text-sm" numberOfLines={2}>
                    {item.content}
                  </Text>
                )}
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between">
                {item.createdAt && (
                  <Text className="text-gray-400 text-xs">
                    {formatTimeAgo(item.createdAt)}
                  </Text>
                )}
                {item.status === "pending" && (
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleUpdateStatus("resolved")}
                      className="bg-green-50 px-2.5 py-1 rounded-lg flex-row items-center"
                    >
                      <Ionicons name="checkmark" size={14} color="#16A34A" />
                      <Text className="text-green-600 text-xs ml-1 font-medium">
                        Xử lý
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setSelectedReport(item);
                        handleUpdateStatus("rejected");
                      }}
                      className="bg-red-50 px-2.5 py-1 rounded-lg flex-row items-center"
                    >
                      <Ionicons name="close" size={14} color="#DC2626" />
                      <Text className="text-red-600 text-xs ml-1 font-medium">
                        Từ chối
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
      />

      {/* Detail Modal */}
      <Portal>
        <Modal
          visible={actionModal}
          onDismiss={() => setActionModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          {selectedReport && (
            <>
              <Text className="text-lg font-bold text-gray-900 mb-2">
                Chi tiết báo cáo
              </Text>
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="text-gray-700 font-medium mb-1">
                  Lý do: {selectedReport.reason}
                </Text>
                {selectedReport.content && (
                  <Text className="text-gray-500 text-sm">
                    {selectedReport.content}
                  </Text>
                )}
              </View>
              <Text className="text-gray-500 text-sm mb-4">
                Trạng thái hiện tại:{" "}
                {STATUS_CONFIG[selectedReport.status]?.label}
              </Text>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus("resolved")}
                buttonColor="#16A34A"
                className="mb-2"
                contentStyle={{ paddingVertical: 4 }}
                icon="check-circle"
              >
                Đã xử lý
              </Button>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus("rejected")}
                buttonColor="#DC2626"
                className="mb-2"
                contentStyle={{ paddingVertical: 4 }}
                icon="close-circle"
              >
                Từ chối
              </Button>
              <Button
                mode="outlined"
                onPress={() => setActionModal(false)}
                className="mt-1"
                textColor="#6B7280"
              >
                Đóng
              </Button>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}
