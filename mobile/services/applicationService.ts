import instance from "./instance";

export const createApplicationApi = (data: any) => {
  return instance.post("/applications", data);
};

export const getAllApplicationsApi = (params?: any) => {
  return instance.get("/applications", { params });
};

export const getApplicationsByPostApi = (postId: string, params?: any) => {
  return instance.get(`/applications/post/${postId}`, { params });
};

export const getMyApplicationsApi = (params?: any) => {
  return instance.get("/applications/my-applications", { params });
};

export const getApplicationByIdApi = (id: string) => {
  return instance.get(`/applications/${id}`);
};

export const deleteApplicationApi = (id: string) => {
  return instance.delete(`/applications/${id}`);
};
