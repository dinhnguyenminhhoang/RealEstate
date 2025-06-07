import { message } from "antd";
import axios from "axios";

export const BASEIMAGE = import.meta.env.VITE_SERVER_BASE_URL;
export const fetchProvinces = async (setLocationOptions) => {
  try {
    const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
    const options = res.data.map((province) => ({
      label: province.name,
      value: province.name,
      children: province.districts.map((district) => ({
        label: district.name,
        value: district.name,
        children: district.wards.map((ward) => ({
          label: ward.name,
          value: ward.name,
        })),
      })),
    }));
    setLocationOptions(options);
  } catch (error) {
    message.error("Failed to load location data");
  }
};
export const fetchCity = async (setLocationOptions) => {
  try {
    const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
    const options = res.data.map((province) => ({
      label: province.name,
      value: province.name,
    }));
    setLocationOptions(options);
  } catch (error) {
    message.error("Failed to load location data");
  }
};
export const formatCurrencyVND = (amount) => {
  if (typeof amount !== "number") {
    throw new Error("Số tiền phải là kiểu số.");
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
export const formatDateTime = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string") {
    throw new Error("Tham số phải là một chuỗi.");
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export function formatTimeAgo(isoDateString) {
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  // Tính toán khoảng thời gian
  const intervals = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
    giây: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit} trước`;
    }
  }

  return "Vừa xong";
}
export function formatMoneyVND(amount) {
  if (isNaN(amount)) return "0 ₫";

  // Xử lý số âm (nếu cần)
  const absAmount = Math.abs(amount);
  let suffix = "";

  if (absAmount >= 1000000000) {
    // Format tỷ
    const ty = absAmount / 1000000000;
    suffix = ty.toFixed(1).endsWith(".0")
      ? `${Math.floor(ty)} tỷ`
      : `${ty.toFixed(1)} tỷ`;
  } else if (absAmount >= 1000000) {
    // Format triệu
    const trieu = absAmount / 1000000;
    suffix = trieu.toFixed(1).endsWith(".0")
      ? `${Math.floor(trieu)} triệu`
      : `${trieu.toFixed(1)} triệu`;
  } else if (absAmount >= 1000) {
    // Format nghìn
    const nghin = absAmount / 1000;
    suffix = `${nghin.toFixed(0)} nghìn`;
  } else {
    suffix = `${absAmount} ₫`;
  }

  return amount < 0 ? `-${suffix}` : suffix;
}
export const stripHtmlAndLimitLength = (htmlContent, maxLength = 100) => {
  if (!htmlContent) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  let textContent = tempDiv.textContent || tempDiv.innerText || "";
  if (textContent.length > maxLength) {
    textContent = textContent.substring(0, maxLength) + "...";
  }

  return textContent;
};
