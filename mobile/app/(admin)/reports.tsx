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
import { Chip, Button, Modal, Portal } from "react-native-paper";

import {
  getAllReportApi,
  updateStatusReportApi,
} from "@/services/reportService";
import { useNotification } from "@/hooks/useNotification";
import { Report, Post, User } from "@/types";
import { formatTimeAgo } from "@/utils";

const statusMap: Record<string, { label: string; color: string; bg: string }> =
  {
    pending: { label: "Chờ xử lý", color: "#D97706", bg: "#FFFBEB" },
    resolved: { label: "Đã xử lý", color: "#16A34A", bg: "#F0FDF4" },
    rejected: { label: "Từ chối", color: "#DC2626", bg: "#FEF2F2" },
  };

export default function AdminReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      showSuccess(`Đã cập nhật: ${statusMap[status]?.label}`);
      setActionModal(false);
      fetchData();
    } catch (e) {
      handleError(e);
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="flag-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4">Chưa có báo cáo</Text>
          </View>
        }
        renderItem={({ item }) => {
          const postTitle =
            typeof item.post === "object"
              ? (item.post as Post).title
              : "Bài đăng";
          const authorName =
            typeof item.author === "object"
              ? (item.author as User).userName
              : "Người dùng";
          const st = statusMap[item.status] || statusMap.pending;

          return (
            <Pressable
              onPress={() => {
                setSelectedReport(item);
                setActionModal(true);
              }}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="font-bold text-gray-900" numberOfLines={1}>
                    {postTitle}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-0.5">
                    Báo cáo bởi: {authorName}
                  </Text>
                </View>
                <Chip
                  compact
                  mode="flat"
                  textStyle={{ fontSize: 10, color: st.color }}
                  style={{ backgroundColor: st.bg }}
                >
                  {st.label}
                </Chip>
              </View>
              <View className="bg-gray-50 rounded-lg p-3 mt-2">
                <Text className="text-gray-800 font-medium text-sm">
                  Lý do: {item.reason}
                </Text>
                {item.content && (
                  <Text
                    className="text-gray-600 text-sm mt-1"
                    numberOfLines={2}
                  >
                    {item.content}
                  </Text>
                )}
              </View>
              {item.createdAt && (
                <Text className="text-gray-400 text-xs mt-2">
                  {formatTimeAgo(item.createdAt)}
                </Text>
              )}
            </Pressable>
          );
        }}
      />

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
          <Text className="text-lg font-bold mb-4">Cập nhật trạng thái</Text>
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("resolved")}
            buttonColor="#16A34A"
            className="mb-3"
            contentStyle={{ paddingVertical: 4 }}
          >
            ✓ Đã xử lý
          </Button>
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("rejected")}
            buttonColor="#DC2626"
            className="mb-3"
            contentStyle={{ paddingVertical: 4 }}
          >
            ✕ Từ chối
          </Button>
          <Button
            mode="outlined"
            onPress={() => setActionModal(false)}
            className="mt-1"
          >
            Đóng
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
