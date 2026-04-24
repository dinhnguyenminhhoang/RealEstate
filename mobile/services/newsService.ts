import instance from "./instance";

export const getAllNewsApi = (params?: any) => {
  return instance.get("/news", { params });
};

export const getNewsDetailApi = (id: string) => {
  return instance.get(`/news/${id}`);
};

export const createNewsApi = (data: any) => {
  return instance.post("/news", data);
};

export const adminEditNewsApi = (data: any, id: string) => {
  return instance.put(`/news/${id}`, data);
};

export const deleteNewsApi = (id: string) => {
  return instance.delete(`/news/${id}`);
};
