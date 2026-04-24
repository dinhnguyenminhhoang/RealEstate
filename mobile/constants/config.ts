// API Configuration
export const API_BASE_URL = "http://192.168.1.100:3055/v1/api"; // TODO: Thay đổi IP theo máy server

// App info
export const APP_NAME = "BĐS Online";
export const APP_VERSION = "1.0.0";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Image
export const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL.replace("/v1/api", "")}${path}`;
};
