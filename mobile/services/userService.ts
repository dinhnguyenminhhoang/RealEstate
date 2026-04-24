import instance from "./instance";

export const getUserProfileApi = () => {
  return instance.get("/profile");
};

export const updateUserProfileApi = (data: any) => {
  return instance.post("/profile", data);
};

export const savePostApi = (postId: string) => {
  return instance.put(`/user/save-post/${postId}`);
};

export const userGetAllFavoriteList = () => {
  return instance.get("/user/favorite-post");
};

// Admin
export const getAllUserApi = (params?: any) => {
  return instance.get("/user", { params });
};

export const createNewUserApi = (data: any) => {
  return instance.post("/user", data);
};

export const adminUpdateUserApi = (userId: string, data: any) => {
  return instance.put(`/user/${userId}`, data);
};

export const deleteUserApi = (userId: string) => {
  return instance.delete(`/user/${userId}`);
};
