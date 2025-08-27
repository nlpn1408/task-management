import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: API_BASE_URL
});

// Token will be set by the component using the auth context
let authToken = localStorage.getItem("accessToken") || null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      console.log(
        "🚀 ~ Setting Authorization token:",
        authToken.substring(0, 50) + "..."
      );
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.log("🚀 ~ No auth token available");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
