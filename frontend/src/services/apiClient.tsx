import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ======================= REQUEST INTERCEPTOR =======================
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================= RESPONSE INTERCEPTOR =======================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ========== AUTO REFRESH TOKEN ==========
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");

        return Promise.reject(
          (refreshError as { response?: { data?: unknown } })?.response?.data ??
            refreshError
        );
      }
    }

    return Promise.reject(
      (error as { response?: { data?: unknown } })?.response?.data ?? error
    );
  }
);

export default apiClient;
