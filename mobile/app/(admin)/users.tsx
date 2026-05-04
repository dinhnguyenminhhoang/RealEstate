import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, RefreshControl, ActivityIndicator, Alert, Pressable, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Searchbar, Chip, Button, Modal, Portal, TextInput } from "react-native-paper";
import { getAllUserApi, deleteUserApi, createNewUserApi, adminUpdateUserApi } from "@/services/userService";
import { useNotification } from "@/hooks/useNotification";
import { User, PaginationMeta } from "@/types";
import { formatDateTime } from "@/utils";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, limit: 10, page: 1, totalPages: 1 });
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ userName: "", email: "", phone: "", password: "", address: "" });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const res: any = await getAllUserApi({ page, limit: 10 });
      if (res?.status === 200) {
        setUsers(res.data?.data || []);
        if (res.data?.meta) setMeta(res.data.meta);
      }
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); await fetchUsers(1); setRefreshing(false);
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ userName: "", email: "", phone: "", password: "", address: "" });
    setModalVisible(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ userName: user.userName, email: user.email, phone: user.phone || "", password: "", address: user.address || "" });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.userName || !form.email) return;
    setSaving(true);
    try {
      if (editingUser) {
        const payload: any = { userName: form.userName, email: form.email, phone: form.phone, address: form.address };
        if (form.password) payload.password = form.password;
        await adminUpdateUserApi(editingUser._id, payload);
        showSuccess("Cập nhật thành công");
      } else {
        if (!form.password) { setSaving(false); return; }
        await createNewUserApi({ ...form, address: form.address || "chưa cập nhật" });
        showSuccess("Tạo mới thành công");
      }
      setModalVisible(false);
      fetchUsers(meta.page);
    } catch (e) { handleError(e); }
    finally { setSaving(false); }
  };

  const handleDelete = (user: User) => {
    Alert.alert("Xác nhận xóa", `Bạn muốn xóa "${user.userName}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: "destructive",
        onPress: async () => {
          try { await deleteUserApi(user._id); showSuccess("Đã xóa"); fetchUsers(meta.page); }
          catch (e) { handleError(e); }
        },
      },
    ]);
  };

  const filtered = search
    ? users.filter((u) => u.userName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (loading) return <View className="flex-1 items-center justify-center bg-white"><ActivityIndicator size="large" color="#DC2626" /></View>;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search + Add */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center gap-2">
          <Searchbar placeholder="Tìm theo tên, email..." value={search} onChangeText={setSearch}
            className="flex-1 bg-white" style={{ height: 44 }} inputStyle={{ fontSize: 14 }} />
          <Pressable onPress={openCreate} className="bg-red-500 h-11 w-11 rounded-xl items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
        <Text className="text-gray-400 text-xs mt-2">Tổng: {meta.total} người dùng</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#DC2626"]} />}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">Không tìm thấy người dùng</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-2.5 shadow-sm">
            <View className="flex-row items-start">
              {/* Avatar */}
              <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Text className="text-blue-600 font-bold text-base">{item.userName?.charAt(0)?.toUpperCase()}</Text>
              </View>
              {/* Info */}
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-base">{item.userName}</Text>
                <Text className="text-gray-500 text-sm">{item.email}</Text>
                {item.phone && <Text className="text-gray-400 text-xs mt-0.5">{item.phone}</Text>}
                {/* Tags */}
                <View className="flex-row mt-2 gap-1.5 flex-wrap">
                  {item.roles?.map((r) => (
                    <View key={r} className={`px-2 py-0.5 rounded ${r === "ADMIN" ? "bg-red-100" : "bg-blue-50"}`}>
                      <Text className={`text-xs font-semibold ${r === "ADMIN" ? "text-red-600" : "text-blue-600"}`}>{r}</Text>
                    </View>
                  ))}
                  <View className={`px-2 py-0.5 rounded ${item.status === "active" ? "bg-green-50" : "bg-red-50"}`}>
                    <Text className={`text-xs font-medium ${item.status === "active" ? "text-green-600" : "text-red-600"}`}>
                      {item.status === "active" ? "Hoạt động" : "Vô hiệu"}
                    </Text>
                  </View>
                  {item.verification && (
                    <View className="bg-green-50 px-2 py-0.5 rounded">
                      <Text className="text-green-600 text-xs">✓ Đã xác thực</Text>
                    </View>
                  )}
                </View>
                {item.createdAt && (
                  <Text className="text-gray-400 text-xs mt-1.5">{formatDateTime(item.createdAt)}</Text>
                )}
              </View>
              {/* Actions */}
              <View className="flex-row gap-1.5">
                <Pressable onPress={() => openEdit(item)} className="bg-blue-50 p-2 rounded-lg">
                  <Ionicons name="create-outline" size={18} color="#2563EB" />
                </Pressable>
                <Pressable onPress={() => handleDelete(item)} className="bg-red-50 p-2 rounded-lg">
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          meta.totalPages > 1 ? (
            <View className="flex-row items-center justify-center gap-2 py-4">
              <Pressable
                onPress={() => meta.page > 1 && fetchUsers(meta.page - 1)}
                disabled={meta.page <= 1}
                className={`px-3 py-2 rounded-lg ${meta.page <= 1 ? "bg-gray-100" : "bg-white border border-gray-200"}`}>
                <Ionicons name="chevron-back" size={18} color={meta.page <= 1 ? "#D1D5DB" : "#374151"} />
              </Pressable>
              <Text className="text-gray-600 text-sm">Trang {meta.page}/{meta.totalPages}</Text>
              <Pressable
                onPress={() => meta.page < meta.totalPages && fetchUsers(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className={`px-3 py-2 rounded-lg ${meta.page >= meta.totalPages ? "bg-gray-100" : "bg-white border border-gray-200"}`}>
                <Ionicons name="chevron-forward" size={18} color={meta.page >= meta.totalPages ? "#D1D5DB" : "#374151"} />
              </Pressable>
            </View>
          ) : null
        }
      />

      {/* Form Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{ backgroundColor: "white", margin: 16, borderRadius: 16, padding: 20, maxHeight: "80%" }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-bold text-gray-900 mb-4">{editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}</Text>
            <TextInput label="Họ tên *" value={form.userName} onChangeText={(v) => setForm((p) => ({ ...p, userName: v }))}
              mode="outlined" className="mb-3 bg-white" outlineColor="#D1D5DB" activeOutlineColor="#DC2626" />
            <TextInput label="Email *" value={form.email} onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
              mode="outlined" keyboardType="email-address" autoCapitalize="none" className="mb-3 bg-white" outlineColor="#D1D5DB" activeOutlineColor="#DC2626" />
            <TextInput label="Số điện thoại" value={form.phone} onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
              mode="outlined" keyboardType="phone-pad" className="mb-3 bg-white" outlineColor="#D1D5DB" activeOutlineColor="#DC2626" />
            <TextInput label="Địa chỉ" value={form.address} onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
              mode="outlined" className="mb-3 bg-white" outlineColor="#D1D5DB" activeOutlineColor="#DC2626" />
            <TextInput label={editingUser ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu *"}
              value={form.password} onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
              mode="outlined" secureTextEntry className="mb-4 bg-white" outlineColor="#D1D5DB" activeOutlineColor="#DC2626" />
            <View className="flex-row gap-3">
              <Button mode="outlined" onPress={() => setModalVisible(false)} className="flex-1"
                textColor="#6B7280" style={{ borderColor: "#D1D5DB" }}>Hủy</Button>
              <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving}
                buttonColor="#DC2626" className="flex-1">Lưu</Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}
