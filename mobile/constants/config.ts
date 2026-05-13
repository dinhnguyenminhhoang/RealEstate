export const API_BASE_URL = "http://192.168.1.29:3055/v1/api";

export const APP_NAME = "BĐS Online";
export const APP_VERSION = "1.0.0";

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

export const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
