import instance from "./instance";

export const getHomeApi = (params?: {
  featuredLimit?: number;
  latestLimit?: number;
  categoryLimit?: number;
  newsLimit?: number;
}) => {
  return instance.get("/home", { params });
};
