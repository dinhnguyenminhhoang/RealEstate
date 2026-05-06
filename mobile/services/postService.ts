import instance from "./instance";
import { PostFilters } from "@/types";

export const getAllPostApi = (params: {
  page?: number;
  limit?: number;
  filters?: PostFilters;
}) => {
  const { page = 1, limit = 10, filters = {} } = params;
  return instance.get("/post", { params: { page, limit, ...filters } });
};

export const getPostDetailApi = (id: string, userId?: string) => {
  return instance.get(`/post/${id}`, { params: userId ? { userId } : {} });
};

export const getPostOutstandingApi = (limit: number = 8) => {
  return instance.get("/post-outstanding", { params: { limit } });
};

export const updateViewApi = (id: string) => {
  return instance.put(`/post/${id}/view`);
};

// User authenticated
export const userCreatePostApi = (data: any) => {
  return instance.post("/user-post", data);
};

export const getAllPostByAdminApi = async (params: any) => {
  return await instance.get("/admin-post", { params });
};

export const userGetAllPostApi = (params?: any) => {
  return instance.get("/user-post", { params });
};

export const userGetPostDetailApi = (id: string) => {
  return instance.get(`/user-post/${id}`);
};

export const userUpdatePostApi = (data: any, id: string) => {
  return instance.put(`/user-post/${id}`, data);
};

export const userDeletePostApi = (id: string) => {
  return instance.delete(`/user-post/${id}`);
};

// Admin
export const confirmPostApi = (id: string) => {
  return instance.put(`/confirm-post/${id}`);
};

export const unPublishPostApi = (id: string) => {
  return instance.put(`/unPublish-post/${id}`);
};

export const deletePostApi = (id: string) => {
  return instance.delete(`/post/${id}`);
};
