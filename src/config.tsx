import axios from "axios";

// Base URLs
export const baseApiUrl = "https://ecom-api.ahasanhabibroxy.online/api/";
export const storageUrl = "https://ecom-api.ahasanhabibroxy.online/storage/";

// Axios instance
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor → add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;