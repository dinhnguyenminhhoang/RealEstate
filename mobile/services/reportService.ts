import instance from "./instance";

export const createNewReportApi = (data: any) => {
  return instance.post("/report", data);
};

export const getAllReportApi = (params?: any) => {
  return instance.get("/report", { params });
};

export const updateStatusReportApi = (data: any, reportId: string) => {
  return instance.put(`/report/status/${reportId}`, data);
};
