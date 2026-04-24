import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Searchbar,
  Chip,
  Button,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";

import {
  getAllUserApi,
  deleteUserApi,
  createNewUserApi,
  adminUpdateUserApi,
} from "@/services/userService";
import { useNotification } from "@/hooks/useNotification";
import { User } from "@/types";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { showSuccess, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res: any = await getAllUserApi({ page: 1, limit: 100 });
      if (res?.status === 200) setUsers(res.data?.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ userName: "", email: "", phone: "", password: "", address: "" });
    setModalVisible(true);
  };
  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      password: "",
      address: user.address,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await adminUpdateUserApi(editingUser._id, form);
        showSuccess("Cập nhật thành công");
      } else {
        await createNewUserApi(form);
        showSuccess("Tạo mới thành công");
      }
      setModalVisible(false);
      fetchUsers();
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Xóa người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserApi(id);
            showSuccess("Đã xóa");
            fetchUsers();
          } catch (e) {
            handleError(e);
          }
        },
      },
    ]);
  };

  const filtered = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-3 pb-2">
        <Searchbar
          placeholder="Tìm người dùng..."
          value={search}
          onChangeText={setSearch}
          className="bg-white"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-bold text-gray-900">{item.userName}</Text>
                <Text className="text-gray-500 text-sm">{item.email}</Text>
                <View className="flex-row mt-1.5 gap-1">
                  {item.roles.map((r) => (
                    <Chip
                      key={r}
                      compact
                      mode="flat"
                      textStyle={{ fontSize: 10 }}
                    >
                      {r}
                    </Chip>
                  ))}
                  <Chip
                    compact
                    mode="flat"
                    textStyle={{
                      fontSize: 10,
                      color: item.status === "active" ? "#16A34A" : "#DC2626",
                    }}
                    style={{
                      backgroundColor:
                        item.status === "active" ? "#F0FDF4" : "#FEF2F2",
                    }}
                  >
                    {item.status === "active" ? "Hoạt động" : "Vô hiệu"}
                  </Chip>
                </View>
              </View>
              <View className="flex-row gap-1">
                <Button compact mode="text" onPress={() => openEdit(item)}>
                  <Ionicons name="create-outline" size={18} color="#2563EB" />
                </Button>
                <Button
                  compact
                  mode="text"
                  onPress={() => handleDelete(item._id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </Button>
              </View>
            </View>
          </View>
        )}
      />
      <Button
        mode="contained"
        icon="plus"
        onPress={openCreate}
        buttonColor="#DC2626"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          borderRadius: 28,
        }}
        contentStyle={{ paddingVertical: 4 }}
      >
        Thêm
      </Button>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text className="text-lg font-bold mb-3">
            {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
          </Text>
          <TextInput
            label="Họ tên"
            value={form.userName}
            onChangeText={(v) => setForm((p) => ({ ...p, userName: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          <TextInput
            label="Email"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          <TextInput
            label="SĐT"
            value={form.phone}
            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          <TextInput
            label="Địa chỉ"
            value={form.address}
            onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
            mode="outlined"
            className="mb-2 bg-white"
          />
          {!editingUser && (
            <TextInput
              label="Mật khẩu"
              value={form.password}
              onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
              mode="outlined"
              secureTextEntry
              className="mb-2 bg-white"
            />
          )}
          <View className="flex-row gap-3 mt-2">
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              buttonColor="#DC2626"
              className="flex-1"
            >
              Lưu
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
