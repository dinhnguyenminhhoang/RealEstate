import instance from "../config/instance";

const getAllApplicationsApi = ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = "createdAt-desc",
}) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sortBy,
    ...filters,
  }).toString();

  return instance.get(`/applications?${queryParams}`);
};

const getApplicationsByPostApi = (postId, { page = 1, limit = 10 }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
  }).toString();

  return instance.get(`/applications/post/${postId}?${queryParams}`);
};

const getMyApplicationsApi = ({ page = 1, limit = 10 }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
  }).toString();

  return instance.get(`/applications/my-applications?${queryParams}`);
};

const getApplicationByIdApi = (applicationId) => {
  return instance.get(`/applications/${applicationId}`);
};

const createApplicationApi = (formData) => {
  return instance.post("/applications", formData);
};

const deleteApplicationApi = (applicationId) => {
  return instance.delete(`/applications/${applicationId}`);
};

export {
  getAllApplicationsApi,
  getApplicationsByPostApi,
  getMyApplicationsApi,
  getApplicationByIdApi,
  createApplicationApi,
  deleteApplicationApi,
};
