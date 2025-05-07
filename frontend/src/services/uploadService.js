import instance from "../config/instance";

const uploadImageApi = (formData) => {
  return instance.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export { uploadImageApi };
