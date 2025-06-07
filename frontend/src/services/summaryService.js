import instance from "../config/instance";

const getOverallSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(
    `/summary/overall${queryParams ? `?${queryParams}` : ""}`
  );
};

const getDashboardSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(
    `/summary/dashboard${queryParams ? `?${queryParams}` : ""}`
  );
};

const getSearchSummaryApi = (searchParams = {}) => {
  const queryParams = new URLSearchParams(searchParams).toString();
  return instance.get(`/summary/search${queryParams ? `?${queryParams}` : ""}`);
};

const getUserSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(`/summary/users${queryParams ? `?${queryParams}` : ""}`);
};

const getPostSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(`/summary/posts${queryParams ? `?${queryParams}` : ""}`);
};

const getReportSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(
    `/summary/reports${queryParams ? `?${queryParams}` : ""}`
  );
};

const getNewsSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(`/summary/news${queryParams ? `?${queryParams}` : ""}`);
};

const getAuthorSummaryApi = (authorId, filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(
    `/summary/author/${authorId}${queryParams ? `?${queryParams}` : ""}`
  );
};

const getAdminSummaryApi = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return instance.get(`/summary/admin${queryParams ? `?${queryParams}` : ""}`);
};

export {
  getOverallSummaryApi,
  getDashboardSummaryApi,
  getSearchSummaryApi,
  getUserSummaryApi,
  getPostSummaryApi,
  getReportSummaryApi,
  getNewsSummaryApi,
  getAuthorSummaryApi,
  getAdminSummaryApi,
};
