import instance from "../config/instance";

const getAllCategoryApi = ({ page = 1, limit = 6, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();

  return instance.get(`/category?${queryParams}`);
};
const deleteCategoryApi = (categoryId) => {
  return instance.delete(`/category/${categoryId}`);
};
const createCategoryApi = (formData) => {
  return instance.post(`/category`, formData);
};
const admiEditCategoryApi = (formData, categoryId) => {
  return instance.put(`/category/${categoryId}`, formData);
};
export {
  getAllCategoryApi,
  deleteCategoryApi,
  createCategoryApi,
  admiEditCategoryApi,
};
