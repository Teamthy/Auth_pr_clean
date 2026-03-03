import axios from "axios";
import { getCSRFToken, clearCSRFToken } from "./csrf.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

api.interceptors.request.use(async (config) => {
  // Add access token to Authorization header
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Add CSRF token for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(config.method?.toUpperCase())) {
    try {
      const csrfToken = await getCSRFToken();
      config.headers["X-CSRF-Token"] = csrfToken;
    } catch (error) {
      console.warn("Could not add CSRF token:", error);
      const csrfError = new Error("Unable to obtain CSRF token. Ensure backend is running.");
      csrfError.code = "CSRF_FETCH_FAILED";
      throw csrfError;
    }
  }

  return config;
});

let isRefreshing = false;
let refreshQueue = [];

function resolveRefreshQueue(error, token = null) {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => {
    // Clear cached CSRF token after successful request to force fresh token
    clearCSRFToken();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const endpoint = originalRequest?.url || "";

    const isAuthEndpoint = [
      "/auth/login",
      "/auth/register",
      "/auth/google",
      "/auth/refresh",
      "/auth/logout",
      "/auth/resend-verification",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
    ].some((path) => endpoint.includes(path));

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);
        resolveRefreshQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        resolveRefreshQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
