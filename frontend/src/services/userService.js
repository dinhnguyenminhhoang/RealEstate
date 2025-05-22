import instance from "../config/instance";

const getUserProfileAPi = () => {
  return instance.get("/profile");
};

const updateUserProfileApi = (formData) => {
  return instance.post("/profile", formData);
};
const getAllUserApi = ({ page = 1, limit = 6, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();
  return instance.get(`/user?${queryParams}`);
};
const deleteUserApi = (userId) => {
  return instance.delete(`/user/${userId}`);
};
const createNewUserApi = (formData) => {
  return instance.post(`/user`, formData);
};
const adminUpdateUserApi = (userId, formData) => {
  return instance.put(`/user/${userId}`, formData);
};
const savePostApi = (postId) => {
  return instance.put(`/user/save-post/${postId}`);
};
const userGetAllFavoriteList = () => {
  return instance.get(`/user/favorite-post`);
};
export {
  getUserProfileAPi,
  updateUserProfileApi,
  getAllUserApi,
  deleteUserApi,
  createNewUserApi,
  adminUpdateUserApi,
  savePostApi,
  userGetAllFavoriteList,
};
