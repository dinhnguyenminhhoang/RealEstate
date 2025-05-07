import instance from "../config/instance";

const getAllNewsApi = ({ page = 1, limit = 6, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();

  return instance.get(`/news?${queryParams}`);
};
const getNewsDetailApi = (id) => {
  return instance.get(`/news/${id}`);
};
const deleteNewsApi = (newsId) => {
  return instance.delete(`/news/${newsId}`);
};
const createNewsApi = (formData) => {
  return instance.post(`/news`, formData);
};
const admiEditNewsApi = (formData, newsId) => {
  return instance.put(`/news/${newsId}`, formData);
};
export {
  getAllNewsApi,
  deleteNewsApi,
  createNewsApi,
  admiEditNewsApi,
  getNewsDetailApi,
};
