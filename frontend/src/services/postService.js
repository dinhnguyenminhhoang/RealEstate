import instance from "../config/instance";
import Cookie from "js-cookie";

const userCreatePostAPi = (formData) => {
  return instance.post("/user-post", formData);
};
const userGetAllPostAPi = () => {
  return instance.get("/user-post");
};
const getAllPostAPi = ({ page = 1, limit = 6, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();
  return instance.get(`/post?${queryParams}`);
};
const updateViewApi = (id) => {
  return instance.put(`/post/${id}/view`);
};
const userGetYourDetailPost = (id) => {
  return instance.get(`/user-post/${id}`);
};
const userUpdatePostApi = (formData, id) => {
  return instance.put(`/user-post/${id}`, formData);
};
const userDeletePostApi = (id) => {
  return instance.delete(`/user-post/${id}`);
};
const confirmPostApi = (id) => {
  return instance.put(`/confirm-post/${id}`);
};
const unPublishPostApi = (id) => {
  return instance.put(`/unPublish-post/${id}`);
};
const deletePostApi = (id) => {
  return instance.delete(`/post/${id}`);
};
const getPostOutstandingAPi = () => {
  return instance.get("/post-outstanding");
};
const getPostDetailAPi = (id) => {
  const userId = Cookie.get("userId");
  if (userId) {
    const queryParams = new URLSearchParams({
      userId,
    }).toString();
    return instance.get(`/post/${id}?${queryParams}`);
  } else {
    return instance.get(`/post/${id}`);
  }
};
export {
  userCreatePostAPi,
  userGetAllPostAPi,
  userGetYourDetailPost,
  userUpdatePostApi,
  userDeletePostApi,
  getAllPostAPi,
  confirmPostApi,
  deletePostApi,
  getPostOutstandingAPi,
  getPostDetailAPi,
  updateViewApi,
  unPublishPostApi,
};
