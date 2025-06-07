import instance from "../config/instance";

const createNewReportAPi = (formData) => {
  return instance.post(`/report`, formData);
};
const getAllReportApi = ({ page = 1, limit = 6, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();

  return instance.get(`/report?${queryParams}`);
};
const updateStatusReportApi = (formData, id) => {
  return instance.put(`/report/status/${id}`, formData);
};
export { createNewReportAPi, getAllReportApi, updateStatusReportApi };
