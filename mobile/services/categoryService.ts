import instance from "./instance";

export const getAllCategoryApi = (params?: any) => {
  return instance.get("/category", { params });
};

export const createCategoryApi = (data: any) => {
  return instance.post("/category", data);
};

export const adminEditCategoryApi = (data: any, id: string) => {
  return instance.put(`/category/${id}`, data);
};

export const deleteCategoryApi = (id: string) => {
  return instance.delete(`/category/${id}`);
};
