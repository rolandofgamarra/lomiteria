import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/useAuthStore";

/**
 * apiClient: Configured Axios instance for ZarfPizzas backend.
 * Automatically injects the JWT token from the Auth Store into every request.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors (e.g., token expired)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear session on unauthorized
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
