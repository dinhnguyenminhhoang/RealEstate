import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Modal as NativeModal,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Button, TextInput, Modal as PaperModal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";

import { getPostDetailApi, updateViewApi } from "@/services/postService";
import { savePostApi } from "@/services/userService";
import { createNewReportApi } from "@/services/reportService";
import { createApplicationApi } from "@/services/applicationService";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/hooks/useNotification";
import { Post } from "@/types";
import { formatMoneyVND, formatTimeAgo } from "@/utils";
import { getImageUrl } from "@/constants/config";
import { reportReasons } from "@/utils/enum";

const { width, height } = Dimensions.get("window");
const GALLERY_HEIGHT = Math.min(width * 0.78, 320);
const CONTENT_WIDTH = width - 40;
const APPLICATION_MODAL_MAX_HEIGHT = Math.min(height * 0.78, 650);
const APPLICATION_FORM_MAX_HEIGHT = Math.min(height * 0.42, 370);

const getCategoryName = (post: Post) =>
  typeof post.category === "object" ? post.category?.name : "";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, handleError } = useNotification();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [applicationVisible, setApplicationVisible] = useState(false);
  const [appForm, setAppForm] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });

  const fetchPost = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const res: any = await getPostDetailApi(id, user?._id);
      if (res?.status === 200) {
        const viewRes: any = await updateViewApi(id);
        setPost({
          ...res.data,
          views: viewRes?.data?.views ?? res.data?.views,
        });
        setIsFavorite(Boolean(res.data?.isFavorite));
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải chi tiết bài đăng",
      );
    } finally {
      setLoading(false);
    }
  }, [id, user?._id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (user) {
      setAppForm((prev) => ({
        ...prev,
        name: user.userName || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const author = useMemo(
    () => (typeof post?.author === "object" ? post.author : null),
    [post?.author],
  );
  const categoryName = post ? getCategoryName(post) : "";

  const handleFavorite = async () => {
    if (!isAuthenticated) return showError("Vui lòng đăng nhập");
    if (!id) return;

    try {
      await savePostApi(id);
      setIsFavorite(true);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              favorites: isFavorite
                ? prev.favorites || 0
                : (prev.favorites || 0) + 1,
            }
          : prev,
      );
      showSuccess("Đã lưu vào yêu thích");
    } catch (error) {
      handleError(error);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return showError("Chọn lý do báo cáo");

    try {
      await createNewReportApi({
        post: id,
        reason: reportReason,
        content: reportContent,
      });
      showSuccess("Đã gửi báo cáo");
      setReportVisible(false);
      setReportReason("");
      setReportContent("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleApplication = async () => {
    if (!appForm.name || !appForm.phone || !appForm.email) {
      return showError("Điền đầy đủ thông tin");
    }

    try {
      await createApplicationApi({
        ...appForm,
        fullName: appForm.name,
        post: id,
      });
      showSuccess("Đã gửi liên hệ");
      setApplicationVisible(false);
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Đang tải bài đăng...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.emptyScreen}>
        <Ionicons name="alert-circle-outline" size={58} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Không tìm thấy bài đăng</Text>
        {errorMessage ? <Text style={styles.emptyText}>{errorMessage}</Text> : null}
        <Button
          mode="contained"
          onPress={() => router.back()}
          buttonColor="#DC2626"
          style={styles.emptyButton}
        >
          Quay lại
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.gallery}>
            {post.images?.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    setActiveImageIndex(
                      Math.round(event.nativeEvent.contentOffset.x / width),
                    );
                  }}
                >
                  {post.images.map((image, index) => (
                    <Image
                      key={`${image.path}-${index}`}
                      source={{ uri: getImageUrl(image.path) }}
                      style={styles.galleryImage}
                      contentFit="cover"
                      transition={180}
                    />
                  ))}
                </ScrollView>
                <View style={styles.imageCounter}>
                  <Ionicons name="images-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.imageCounterText}>
                    {activeImageIndex + 1}/{post.images.length}
                  </Text>
                </View>
                <View style={styles.imageDots}>
                  {post.images.slice(0, 6).map((image, index) => (
                    <View
                      key={`${image.path}-dot-${index}`}
                      style={[
                        styles.imageDot,
                        activeImageIndex === index && styles.imageDotActive,
                      ]}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.galleryFallback}>
                <Ionicons name="image-outline" size={58} color="#9CA3AF" />
              </View>
            )}

            <View style={styles.galleryTopActions}>
              <Pressable onPress={() => router.back()} style={styles.roundButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Pressable onPress={handleFavorite} style={styles.roundButton}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={23}
                  color={isFavorite ? "#FCA5A5" : "#FFFFFF"}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.summaryCard}>
              <View style={styles.badgeRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    {post.type === "SELL" ? "Bán" : "Cho thuê"}
                  </Text>
                </View>
                {categoryName ? (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{categoryName}</Text>
                  </View>
                ) : null}
                {post.verification ? (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                    <Text style={styles.verifiedBadgeText}>Đã duyệt</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.price}>{formatMoneyVND(post.price)}</Text>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={17} color="#DC2626" />
                <Text style={styles.addressText}>{post.address}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="resize-outline" size={18} color="#DC2626" />
                  <Text style={styles.statValue}>
                    {post.acreage ? `${post.acreage} m²` : "Chưa có"}
                  </Text>
                  <Text style={styles.statLabel}>Diện tích</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="eye-outline" size={18} color="#DC2626" />
                  <Text style={styles.statValue}>{post.views || 0}</Text>
                  <Text style={styles.statLabel}>Lượt xem</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={18} color="#DC2626" />
                  <Text style={styles.statValue}>{post.favorites || 0}</Text>
                  <Text style={styles.statLabel}>Yêu thích</Text>
                </View>
              </View>

              {post.createdAt ? (
                <View style={styles.postedAt}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.postedAtText}>
                    Đăng {formatTimeAgo(post.createdAt)}
                  </Text>
                </View>
              ) : null}
            </View>

            {post.overview ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Tổng quan</Text>
                <RenderHtml
                  contentWidth={CONTENT_WIDTH}
                  source={{ html: post.overview }}
                  baseStyle={styles.htmlBase}
                  tagsStyles={{
                    p: styles.htmlParagraph,
                    li: styles.htmlParagraph,
                    strong: styles.htmlStrong,
                  }}
                />
              </View>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mô tả chi tiết</Text>
              {post.description ? (
                <RenderHtml
                  contentWidth={CONTENT_WIDTH}
                  source={{ html: post.description }}
                  baseStyle={styles.htmlBase}
                  tagsStyles={{
                    p: styles.htmlParagraph,
                    li: styles.htmlParagraph,
                    strong: styles.htmlStrong,
                  }}
                />
              ) : (
                <Text style={styles.mutedText}>Không có mô tả</Text>
              )}
            </View>

            {author ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
                <View style={styles.authorRow}>
                  <View style={styles.avatar}>
                    {author.avatar ? (
                      <Image
                        source={{ uri: getImageUrl(author.avatar) }}
                        style={styles.avatarImage}
                        contentFit="cover"
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {author.userName?.charAt(0)?.toUpperCase() || "U"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{author.userName}</Text>
                    <Text style={styles.authorMeta} numberOfLines={1}>
                      {author.email}
                    </Text>
                    {author.address ? (
                      <Text style={styles.authorMeta} numberOfLines={1}>
                        {author.address}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.contactButtons}>
                  <Button
                    mode="contained"
                    icon="phone"
                    onPress={() => Linking.openURL(`tel:${author.phone}`)}
                    buttonColor="#16A34A"
                    textColor="#FFFFFF"
                    style={styles.contactButton}
                    contentStyle={styles.contactButtonContent}
                  >
                    Gọi điện
                  </Button>
                  <Button
                    mode="outlined"
                    icon="email-outline"
                    onPress={() => Linking.openURL(`mailto:${author.email}`)}
                    textColor="#DC2626"
                    style={styles.contactButton}
                    contentStyle={styles.contactButtonContent}
                  >
                    Email
                  </Button>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable onPress={handleFavorite} style={styles.bottomIconButton}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={25}
              color={isFavorite ? "#DC2626" : "#6B7280"}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              isAuthenticated
                ? setReportVisible(true)
                : showError("Vui lòng đăng nhập")
            }
            style={styles.bottomIconButton}
          >
            <Ionicons name="flag-outline" size={23} color="#6B7280" />
          </Pressable>
          <Button
            mode="contained"
            onPress={() =>
              isAuthenticated
                ? setApplicationVisible(true)
                : showError("Vui lòng đăng nhập")
            }
            buttonColor="#DC2626"
            textColor="#FFFFFF"
            style={styles.primaryAction}
            contentStyle={styles.primaryActionContent}
            labelStyle={styles.primaryActionLabel}
          >
            Liên hệ ngay
          </Button>
        </View>

        <Portal>
          <PaperModal
            visible={reportVisible}
            onDismiss={() => setReportVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Báo cáo bài đăng</Text>
            <Text style={styles.modalHint}>Chọn lý do:</Text>
            {reportReasons.map((reason) => (
              <Pressable
                key={reason}
                onPress={() => setReportReason(reason)}
                style={[
                  styles.reasonItem,
                  reportReason === reason && styles.reasonItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.reasonText,
                    reportReason === reason && styles.reasonTextActive,
                  ]}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}
            <TextInput
              label="Chi tiết (tùy chọn)"
              value={reportContent}
              onChangeText={setReportContent}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.modalInput}
              outlineColor="#E5E7EB"
              activeOutlineColor="#DC2626"
            />
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setReportVisible(false)}
                style={styles.modalButton}
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={handleReport}
                buttonColor="#DC2626"
                style={styles.modalButton}
              >
                Gửi báo cáo
              </Button>
            </View>
          </PaperModal>
        </Portal>

        <NativeModal
          visible={applicationVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setApplicationVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            style={styles.applicationOverlay}
          >
            <Pressable
              style={styles.applicationBackdrop}
              onPress={() => setApplicationVisible(false)}
            />
            <View style={styles.applicationModal}>
              <View style={styles.applicationKeyboardView}>
              <View style={styles.applicationHeader}>
                <View style={styles.applicationIcon}>
                  <Ionicons name="chatbox-ellipses-outline" size={22} color="#DC2626" />
                </View>
                <View style={styles.applicationTitleWrap}>
                  <Text style={styles.modalTitle}>Liên hệ bài đăng</Text>
                  <Text style={styles.applicationSubtitle} numberOfLines={2}>
                    Gửi thông tin để chủ bài đăng liên hệ lại với bạn.
                  </Text>
                </View>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.applicationFormScroll}
                contentContainerStyle={styles.applicationFormContent}
              >
                <TextInput
                  label="Họ tên *"
                  value={appForm.name}
                  onChangeText={(value) =>
                    setAppForm((prev) => ({ ...prev, name: value }))
                  }
                  mode="outlined"
                  style={styles.modalInput}
                  outlineStyle={styles.modalInputOutline}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#DC2626"
                  textColor="#111827"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  left={<TextInput.Icon icon="account-outline" color="#6B7280" />}
                />
                <TextInput
                  label="Số điện thoại *"
                  value={appForm.phone}
                  onChangeText={(value) =>
                    setAppForm((prev) => ({ ...prev, phone: value }))
                  }
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.modalInput}
                  outlineStyle={styles.modalInputOutline}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#DC2626"
                  textColor="#111827"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  left={<TextInput.Icon icon="phone-outline" color="#6B7280" />}
                />
                <TextInput
                  label="Email *"
                  value={appForm.email}
                  onChangeText={(value) =>
                    setAppForm((prev) => ({ ...prev, email: value }))
                  }
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={styles.modalInput}
                  outlineStyle={styles.modalInputOutline}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#DC2626"
                  textColor="#111827"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  left={<TextInput.Icon icon="email-outline" color="#6B7280" />}
                />
                <TextInput
                  label="Nội dung (tùy chọn)"
                  value={appForm.content}
                  onChangeText={(value) =>
                    setAppForm((prev) => ({ ...prev, content: value }))
                  }
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={[styles.modalInput, styles.applicationMessageInput]}
                  outlineStyle={styles.modalInputOutline}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#DC2626"
                  textColor="#111827"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                  blurOnSubmit
                  left={<TextInput.Icon icon="message-text-outline" color="#6B7280" />}
                />
              </ScrollView>

              <View style={styles.applicationActions}>
                <Button
                  mode="outlined"
                  onPress={() => setApplicationVisible(false)}
                  textColor="#DC2626"
                  style={styles.modalButton}
                  contentStyle={styles.applicationButtonContent}
                >
                  Hủy
                </Button>
                <Button
                  mode="contained"
                  onPress={handleApplication}
                  buttonColor="#DC2626"
                  textColor="#FFFFFF"
                  style={styles.modalButton}
                  contentStyle={styles.applicationButtonContent}
                  labelStyle={styles.applicationSubmitLabel}
                >
                  Gửi liên hệ
                </Button>
              </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </NativeModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111827",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 12,
  },
  emptyScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 14,
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 18,
    borderRadius: 12,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  gallery: {
    height: GALLERY_HEIGHT,
    backgroundColor: "#E5E7EB",
  },
  galleryImage: {
    width,
    height: GALLERY_HEIGHT,
  },
  galleryFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryTopActions: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17,24,39,0.58)",
  },
  imageCounter: {
    position: "absolute",
    right: 16,
    bottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(17,24,39,0.68)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  imageDots: {
    position: "absolute",
    left: 16,
    bottom: 20,
    flexDirection: "row",
    gap: 5,
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  imageDotActive: {
    width: 18,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: "#DC2626",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "900",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedBadgeText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: "#111827",
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
  },
  price: {
    color: "#DC2626",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 11,
  },
  addressText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    minHeight: 80,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 5,
    textAlign: "center",
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  postedAt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 13,
  },
  postedAtText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  mutedText: {
    color: "#6B7280",
    fontSize: 14,
  },
  htmlBase: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 24,
  },
  htmlParagraph: {
    marginTop: 0,
    marginBottom: 10,
  },
  htmlStrong: {
    color: "#111827",
    fontWeight: "900",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#DC2626",
    fontSize: 22,
    fontWeight: "900",
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  authorMeta: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
    fontWeight: "600",
  },
  contactButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  contactButton: {
    flex: 1,
    borderRadius: 13,
  },
  contactButtonContent: {
    paddingVertical: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  bottomIconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  primaryAction: {
    flex: 1,
    borderRadius: 16,
  },
  primaryActionContent: {
    paddingVertical: 7,
  },
  primaryActionLabel: {
    fontSize: 15,
    fontWeight: "900",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 18,
  },
  applicationOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(17,24,39,0.58)",
  },
  applicationBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  applicationModal: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    alignSelf: "center",
    borderRadius: 24,
    padding: 16,
    maxHeight: APPLICATION_MODAL_MAX_HEIGHT,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  applicationKeyboardView: {
    width: "100%",
  },
  applicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  applicationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
  applicationTitleWrap: {
    flex: 1,
  },
  applicationSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: -4,
  },
  applicationFormScroll: {
    maxHeight: APPLICATION_FORM_MAX_HEIGHT,
  },
  applicationFormContent: {
    paddingBottom: 4,
  },
  modalTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  modalHint: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  reasonItem: {
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F8FAFC",
  },
  reasonItemActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  reasonText: {
    color: "#374151",
    fontWeight: "700",
  },
  reasonTextActive: {
    color: "#DC2626",
    fontWeight: "900",
  },
  modalInput: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  modalInputOutline: {
    borderRadius: 14,
  },
  applicationMessageInput: {
    minHeight: 96,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
  },
  applicationActions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 6,
  },
  applicationButtonContent: {
    paddingVertical: 5,
  },
  applicationSubmitLabel: {
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
