import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  userSummary: any;
  postSummary: any;
  reportSummary: any;
  newsSummary: any;
  overall: any;
}

const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

function BarSimple({ items, maxValue }: { items: { label: string; value: number; color: string }[]; maxValue: number }) {
  return (
    <View className="flex-row items-end gap-1 h-20 mt-2">
      {items.map((item, i) => (
        <View key={i} className="flex-1 items-center">
          <View className="w-full rounded-t" style={{ height: Math.max(4, (item.value / (maxValue || 1)) * 72), backgroundColor: item.color }} />
          <Text className="text-gray-500 text-[8px] mt-1">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function DetailedStats({ userSummary, postSummary, reportSummary, newsSummary, overall }: Props) {
  // User by role
  const roleData = userSummary?.byRole?.map((r: any) => ({
    label: r._id === "ADMIN" ? "Admin" : r._id === "PARTNER" ? "Partner" : "User",
    value: r.count, color: r._id === "ADMIN" ? "#EF4444" : r._id === "PARTNER" ? "#F59E0B" : "#3B82F6",
  })) || [];

  // User verification
  const verifiedCount = userSummary?.byVerification?.find((v: any) => v._id === true)?.count || 0;
  const unverifiedCount = userSummary?.byVerification?.find((v: any) => v._id === false)?.count || 0;
  const totalUsers = verifiedCount + unverifiedCount || 1;
  const verifiedPct = Math.round((verifiedCount / totalUsers) * 100);

  // Post by category
  const catData = (postSummary?.byCategory || []).slice(0, 5);

  // Report by reason
  const reasonData = (reportSummary?.byReason || []).slice(0, 5);
  const reportMaxReason = reasonData[0]?.count || 1;

  // Report by status
  const reportPending = reportSummary?.byStatus?.find((s: any) => s._id === "pending")?.count || 0;
  const reportResolved = reportSummary?.byStatus?.find((s: any) => s._id === "resolved")?.count || 0;
  const reportRejected = reportSummary?.byStatus?.find((s: any) => s._id === "rejected")?.count || 0;

  // News popular tags
  const tagData = (newsSummary?.popularTags || []).slice(0, 6);

  // Report monthly
  const monthlyReports = (reportSummary?.monthly || []).slice(0, 6).reverse();
  const monthlyMax = Math.max(...monthlyReports.map((m: any) => m.count), 1);

  return (
    <View className="gap-4">
      {/* SECTION: User Analytics */}
      <Text className="text-white text-base font-bold">📊 Phân tích người dùng</Text>
      <View className="flex-row gap-3">
        {/* Role distribution */}
        <View className="flex-1 bg-gray-800 rounded-xl p-3">
          <Text className="text-gray-400 text-xs mb-2">Theo vai trò</Text>
          {roleData.map((r: any) => (
            <View key={r.label} className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                <Text className="text-white text-sm">{r.label}</Text>
              </View>
              <Text className="text-white font-bold text-sm">{r.value}</Text>
            </View>
          ))}
        </View>
        {/* Verification */}
        <View className="flex-1 bg-gray-800 rounded-xl p-3">
          <Text className="text-gray-400 text-xs mb-2">Xác thực</Text>
          <View className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-green-500 rounded-full" style={{ width: `${verifiedPct}%` }} />
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-green-400 font-bold">{verifiedCount}</Text>
              <Text className="text-gray-500 text-[10px]">Đã xác thực</Text>
            </View>
            <View className="items-end">
              <Text className="text-yellow-400 font-bold">{unverifiedCount}</Text>
              <Text className="text-gray-500 text-[10px]">Chưa xác thực</Text>
            </View>
          </View>
        </View>
      </View>

      {/* SECTION: Post by Category */}
      {catData.length > 0 && (
        <>
          <Text className="text-white text-base font-bold">🏠 BĐS theo danh mục</Text>
          <View className="bg-gray-800 rounded-xl overflow-hidden">
            {catData.map((cat: any, i: number) => {
              const max = catData[0]?.count || 1;
              const pct = Math.round((cat.count / max) * 100);
              return (
                <View key={cat._id} className={`px-4 py-3 ${i > 0 ? "border-t border-gray-700" : ""}`}>
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-white text-sm flex-1" numberOfLines={1}>{cat._id}</Text>
                    <Text className="text-gray-400 text-xs ml-2">{cat.count} bài</Text>
                  </View>
                  <View className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <View className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* SECTION: Report Analytics */}
      <Text className="text-white text-base font-bold">🚨 Phân tích báo cáo</Text>
      <View className="flex-row gap-3">
        {/* Status */}
        <View className="flex-1 bg-gray-800 rounded-xl p-3">
          <Text className="text-gray-400 text-xs mb-2">Theo trạng thái</Text>
          {[
            { label: "Chờ xử lý", value: reportPending, color: "#F59E0B" },
            { label: "Đã xử lý", value: reportResolved, color: "#10B981" },
            { label: "Từ chối", value: reportRejected, color: "#EF4444" },
          ].map((s) => (
            <View key={s.label} className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color }} />
                <Text className="text-white text-xs">{s.label}</Text>
              </View>
              <Text className="text-white font-bold text-sm">{s.value}</Text>
            </View>
          ))}
        </View>
        {/* Monthly chart */}
        {monthlyReports.length > 0 && (
          <View className="flex-1 bg-gray-800 rounded-xl p-3">
            <Text className="text-gray-400 text-xs mb-1">Theo tháng</Text>
            <BarSimple
              items={monthlyReports.map((m: any) => ({
                label: MONTHS[(m._id?.month || 1) - 1],
                value: m.count,
                color: "#F59E0B",
              }))}
              maxValue={monthlyMax}
            />
          </View>
        )}
      </View>

      {/* Top Report Reasons */}
      {reasonData.length > 0 && (
        <View className="bg-gray-800 rounded-xl p-3">
          <Text className="text-gray-400 text-xs mb-2">Lý do báo cáo phổ biến</Text>
          {reasonData.map((r: any, i: number) => (
            <View key={r._id} className="mb-2">
              <View className="flex-row justify-between mb-0.5">
                <Text className="text-white text-xs flex-1" numberOfLines={1}>{r._id}</Text>
                <Text className="text-gray-400 text-xs">{r.count}</Text>
              </View>
              <View className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <View className="h-full bg-red-500 rounded-full" style={{ width: `${(r.count / reportMaxReason) * 100}%` }} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* News Tags */}
      {tagData.length > 0 && (
        <>
          <Text className="text-white text-base font-bold">📰 Tags tin tức phổ biến</Text>
          <View className="flex-row flex-wrap gap-2">
            {tagData.map((t: any) => (
              <View key={t._id} className="bg-gray-800 px-3 py-2 rounded-xl flex-row items-center">
                <Text className="text-purple-400 text-sm">#{t._id}</Text>
                <View className="bg-purple-900 px-1.5 py-0.5 rounded ml-2">
                  <Text className="text-purple-300 text-xs font-bold">{t.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
