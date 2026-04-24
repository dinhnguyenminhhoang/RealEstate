import instance from "./instance";

export const getOverallSummaryApi = () => {
  return instance.get("/summary/overall");
};

export const getDashboardSummaryApi = (params?: any) => {
  return instance.get("/summary/dashboard", { params });
};

export const getSearchSummaryApi = (params: { searchTerm: string }) => {
  return instance.get("/summary/search", { params });
};

export const getUserSummaryApi = () => {
  return instance.get("/summary/users");
};

export const getPostSummaryApi = () => {
  return instance.get("/summary/posts");
};

export const getReportSummaryApi = () => {
  return instance.get("/summary/reports");
};

export const getNewsSummaryApi = () => {
  return instance.get("/summary/news");
};

export const getAuthorSummaryApi = (authorId: string) => {
  return instance.get(`/summary/author/${authorId}`);
};

export const getAdminSummaryApi = () => {
  return instance.get("/summary/admin");
};
