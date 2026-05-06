import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  TextInput as RNTextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput, Chip } from "react-native-paper";
import { router } from "expo-router";
import {
  getAllUserApi,
  deleteUserApi,
  createNewUserApi,
  adminUpdateUserApi,
} from "@/services/userService";
import { useNotification } from "@/hooks/useNotification";
import { User, PaginationMeta } from "@/types";
import { formatDateTime } from "@/utils";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
  });
  const { showSuccess, showError, handleError } = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    roles: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const res: any = await getAllUserApi({ page, limit: 10 });
      if (res?.status === 200) {
        setUsers(res.data?.data || []);
        if (res.data?.meta) setMeta(res.data.meta);
      }
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
    await fetchUsers(1);
    setRefreshing(false);
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({
      userName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      roles: ["USER"],
    });
    setModalVisible(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      userName: user.userName,
      email: user.email,
      phone: user.phone || "",
      password: "",
      confirmPassword: "",
      address: user.address || "",
      roles: user.roles || ["USER"],
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.userName || !form.email) {
      showError("Vui lòng điền đủ thông tin bắt buộc");
      return;
    }
    if (form.roles.length === 0) {
      showError("Vui lòng chọn ít nhất một vai trò");
      return;
    }

    if (!editingUser || form.password) {
      if (form.password !== form.confirmPassword) {
        showError("Hai mật khẩu không trùng khớp!");
        return;
      }
      if (form.password.length < 8) {
        showError("Mật khẩu phải có ít nhất 8 ký tự");
        return;
      }
    }

    setSaving(true);
    try {
      if (editingUser) {
        const payload: any = {
          userName: form.userName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          roles: form.roles,
        };
        if (form.password) payload.password = form.password;
        await adminUpdateUserApi(editingUser._id, payload);
        showSuccess("Cập nhật thành công");
      } else {
        if (!form.password) {
          setSaving(false);
          showError("Vui lòng nhập mật khẩu");
          return;
        }
        await createNewUserApi({
          ...form,
          address: form.address || "chưa cập nhật",
          roles: form.roles,
        });
        showSuccess("Tạo mới thành công");
      }
      setModalVisible(false);
      fetchUsers(meta.page);
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: User) => {
    Alert.alert("Xác nhận xóa", `Bạn muốn xóa "${user.userName}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserApi(user._id);
            showSuccess("Đã xóa");
            fetchUsers(meta.page);
          } catch (e) {
            handleError(e);
          }
        },
      },
    ]);
  };

  const filtered = search
    ? users.filter(
        (u) =>
          u.userName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-full bg-white border border-gray-100 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
            </Pressable>
            <View>
              <Text className="text-gray-900 text-xl font-bold">
                Người dùng
              </Text>
              <Text className="text-gray-500 text-sm">Quản lý tài khoản</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <RNTextInput
              className="flex-1 ml-2 text-gray-900 text-sm h-full"
              placeholder="Tìm theo tên, email..."
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
          <Pressable
            onPress={openCreate}
            className="bg-gray-900 h-11 w-11 rounded-xl items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          Tổng: {meta.total} người dùng
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#111827"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">
              Không tìm thấy người dùng
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-2.5 shadow-sm">
            <View className="flex-row items-start">
              <View className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 items-center justify-center mr-3">
                <Text className="text-gray-700 font-bold text-base">
                  {item.userName?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-base">
                  {item.userName}
                </Text>
                <Text className="text-gray-500 text-sm">{item.email}</Text>
                {item.phone && (
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {item.phone}
                  </Text>
                )}
                <View className="flex-row mt-2 gap-1.5 flex-wrap">
                  {item.roles?.map((r) => (
                    <View key={r} className={`px-2 py-0.5 rounded bg-gray-100`}>
                      <Text className={`text-xs font-semibold text-gray-700`}>
                        {r}
                      </Text>
                    </View>
                  ))}
                  <View
                    className={`px-2 py-0.5 rounded ${item.status === "active" ? "bg-gray-100" : "bg-gray-200"}`}
                  >
                    <Text className={`text-xs font-medium text-gray-700`}>
                      {item.status === "active" ? "Hoạt động" : "Vô hiệu"}
                    </Text>
                  </View>
                  {item.verification && (
                    <View className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      <Text className="text-gray-700 text-xs">
                        ✓ Đã xác thực
                      </Text>
                    </View>
                  )}
                </View>
                {item.createdAt && (
                  <Text className="text-gray-400 text-xs mt-1.5">
                    {formatDateTime(item.createdAt)}
                  </Text>
                )}
              </View>
              <View className="flex-row gap-1.5">
                <Pressable
                  onPress={() => openEdit(item)}
                  className="bg-gray-50 p-2 rounded-lg border border-gray-100"
                >
                  <Ionicons name="create-outline" size={18} color="#4B5563" />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  className="bg-gray-50 p-2 rounded-lg border border-gray-100"
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
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
                className={`px-3 py-2 rounded-lg ${meta.page <= 1 ? "bg-gray-100" : "bg-white border border-gray-200"}`}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={meta.page <= 1 ? "#D1D5DB" : "#374151"}
                />
              </Pressable>
              <Text className="text-gray-600 text-sm">
                Trang {meta.page}/{meta.totalPages}
              </Text>
              <Pressable
                onPress={() =>
                  meta.page < meta.totalPages && fetchUsers(meta.page + 1)
                }
                disabled={meta.page >= meta.totalPages}
                className={`px-3 py-2 rounded-lg ${meta.page >= meta.totalPages ? "bg-gray-100" : "bg-white border border-gray-200"}`}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={meta.page >= meta.totalPages ? "#D1D5DB" : "#374151"}
                />
              </Pressable>
            </View>
          ) : null
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  marginHorizontal: 16,
                  borderRadius: 16,
                  maxHeight: "85%",
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 12,
                  }}
                >
                  <Text className="text-lg font-bold text-gray-900">
                    {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setModalVisible(false);
                    }}
                    className="p-1"
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </Pressable>
                </View>

                {/* Scrollable Form */}
                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <TextInput
                    label="Họ tên *"
                    value={form.userName}
                    onChangeText={(v) =>
                      setForm((p) => ({ ...p, userName: v }))
                    }
                    mode="outlined"
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    multiline={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    left={<TextInput.Icon icon="account-outline" />}
                  />
                  <TextInput
                    label="Email *"
                    value={form.email}
                    onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    left={<TextInput.Icon icon="email-outline" />}
                  />
                  <TextInput
                    label="Số điện thoại"
                    value={form.phone}
                    onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    multiline={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    left={<TextInput.Icon icon="phone-outline" />}
                  />
                  <TextInput
                    label="Địa chỉ"
                    value={form.address}
                    onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
                    mode="outlined"
                    style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#111827"
                    textColor="#111827"
                    multiline={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    left={<TextInput.Icon icon="map-marker-outline" />}
                  />

                  <View className="mb-4 mt-2">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Vai trò *
                    </Text>
                    <View className="flex-row gap-2">
                      {["ADMIN", "USER"].map((role) => {
                        const isSelected = form.roles.includes(role);
                        return (
                          <Chip
                            key={role}
                            mode="outlined"
                            onPress={() => {
                              setForm((p) => ({
                                ...p,
                                roles: isSelected
                                  ? p.roles.filter((r) => r !== role)
                                  : [...p.roles, role],
                              }));
                            }}
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderColor: isSelected ? "#111827" : "#D1D5DB",
                              borderWidth: 1,
                            }}
                            textStyle={{
                              color: isSelected ? "#111827" : "#6B7280",
                              fontWeight: isSelected ? "bold" : "normal",
                            }}
                          >
                            {role}
                          </Chip>
                        );
                      })}
                    </View>
                  </View>

                  {!editingUser && (
                    <>
                      <TextInput
                        label="Mật khẩu *"
                        value={form.password}
                        onChangeText={(v) =>
                          setForm((p) => ({ ...p, password: v }))
                        }
                        mode="outlined"
                        secureTextEntry
                        style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }}
                        outlineColor="#D1D5DB"
                        activeOutlineColor="#111827"
                        textColor="#111827"
                        multiline={false}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        left={<TextInput.Icon icon="lock-outline" />}
                      />
                      <TextInput
                        label="Xác nhận mật khẩu *"
                        value={form.confirmPassword}
                        onChangeText={(v) =>
                          setForm((p) => ({ ...p, confirmPassword: v }))
                        }
                        mode="outlined"
                        secureTextEntry
                        style={{ backgroundColor: "#FFFFFF", marginBottom: 16 }}
                        outlineColor="#D1D5DB"
                        activeOutlineColor="#111827"
                        textColor="#111827"
                        multiline={false}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                        left={<TextInput.Icon icon="lock-check-outline" />}
                      />
                    </>
                  )}

                  {editingUser && (
                    <TextInput
                      label="Mật khẩu mới (bỏ trống nếu không đổi)"
                      value={form.password}
                      onChangeText={(v) =>
                        setForm((p) => ({ ...p, password: v }))
                      }
                      mode="outlined"
                      secureTextEntry
                      style={{ backgroundColor: "#FFFFFF", marginBottom: 16 }}
                      outlineColor="#D1D5DB"
                      activeOutlineColor="#111827"
                      textColor="#111827"
                      multiline={false}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={Keyboard.dismiss}
                      left={<TextInput.Icon icon="lock-outline" />}
                    />
                  )}
                  {editingUser && form.password.length > 0 && (
                    <TextInput
                      label="Xác nhận mật khẩu mới *"
                      value={form.confirmPassword}
                      onChangeText={(v) =>
                        setForm((p) => ({ ...p, confirmPassword: v }))
                      }
                      mode="outlined"
                      secureTextEntry
                      style={{ backgroundColor: "#FFFFFF", marginBottom: 16 }}
                      outlineColor="#D1D5DB"
                      activeOutlineColor="#111827"
                      textColor="#111827"
                      multiline={false}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={Keyboard.dismiss}
                      left={<TextInput.Icon icon="lock-check-outline" />}
                    />
                  )}
                  <View className="flex-row gap-3 justify-end mt-2">
                    <Button
                      mode="outlined"
                      onPress={() => {
                        Keyboard.dismiss();
                        setModalVisible(false);
                      }}
                      textColor="#DC2626"
                      style={{ borderColor: "#DC2626" }}
                    >
                      Hủy
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        Keyboard.dismiss();
                        handleSave();
                      }}
                      loading={saving}
                      disabled={saving}
                      buttonColor="#2563EB"
                    >
                      Lưu
                    </Button>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
