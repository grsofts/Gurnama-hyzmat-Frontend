import axios from "axios";

const http = axios.create({
  baseURL: "http://192.168.0.34:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

http.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }

    // если это refresh — сразу logout
    if (originalRequest.url.includes("/api/refresh")) {
      logoutAndRedirect();
      return Promise.reject(err);
    }

    // защита от повторного ретрая
    if (originalRequest._retry) {
      return Promise.reject(err);
    }

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      logoutAndRedirect();
      return Promise.reject(err);
    }

    originalRequest._retry = true;
    refreshAttempts++;

    try {
      const response = await http.post("/api/refresh");
      const newAccessToken = response.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      refreshAttempts = 0;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    } catch (refreshErr) {
      logoutAndRedirect();
      return Promise.reject(refreshErr);
    }
  }
);

function logoutAndRedirect() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}



export default http;
