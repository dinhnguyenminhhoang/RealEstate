import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { storage } from "@/utils/storage";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor - auto attach auth headers
instance.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    const userId = await storage.getUserId();

    if (userId) {
      config.headers["x-client-id"] = userId;
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - unwrap response.data
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
