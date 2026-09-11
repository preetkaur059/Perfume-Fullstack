import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Cookies are sent automatically by the browser, so a request interceptor is not needed.
// This shared promise makes simultaneous 401 responses wait for one refresh request.
let refreshPromise = null;

const clearAuthenticationAndRedirect = () => {
  window.dispatchEvent(new Event("auth:changed"));

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/users/refresh");

    // `_retry` and the refresh-endpoint check prevent an infinite loop.
    if (!isUnauthorized || !originalRequest || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/users/refresh").finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthenticationAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
