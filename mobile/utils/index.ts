import axios from "axios";

export const formatCurrencyVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatTimeAgo = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: Record<string, number> = {
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
};

export const formatMoneyVND = (amount: number): string => {
  if (isNaN(amount)) return "0 ₫";
  const absAmount = Math.abs(amount);
  let suffix = "";

  if (absAmount >= 1000000000) {
    const ty = absAmount / 1000000000;
    suffix = ty.toFixed(1).endsWith(".0")
      ? `${Math.floor(ty)} tỷ`
      : `${ty.toFixed(1)} tỷ`;
  } else if (absAmount >= 1000000) {
    const trieu = absAmount / 1000000;
    suffix = trieu.toFixed(1).endsWith(".0")
      ? `${Math.floor(trieu)} triệu`
      : `${trieu.toFixed(1)} triệu`;
  } else if (absAmount >= 1000) {
    const nghin = absAmount / 1000;
    suffix = `${nghin.toFixed(0)} nghìn`;
  } else {
    suffix = `${absAmount} ₫`;
  }

  return amount < 0 ? `-${suffix}` : suffix;
};

export const formatAddress = ({
  street,
  ward,
  district,
  city,
}: {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
}): string => {
  return [street, ward, district, city].filter(Boolean).join(", ");
};

// Fetch provinces from open API
interface ProvinceOption {
  label: string;
  value: string;
  children?: ProvinceOption[];
}

export const fetchProvinces = async (): Promise<ProvinceOption[]> => {
  try {
    const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
    return res.data.map((province: any) => ({
      label: province.name,
      value: province.name,
      children: province.districts.map((district: any) => ({
        label: district.name,
        value: district.name,
        children: district.wards.map((ward: any) => ({
          label: ward.name,
          value: ward.name,
        })),
      })),
    }));
  } catch {
    return [];
  }
};

export const fetchCities = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const res = await axios.get("https://provinces.open-api.vn/api/?depth=1");
    return res.data.map((province: any) => ({
      label: province.name,
      value: province.name,
    }));
  } catch {
    return [];
  }
};
