import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor — подставляем текущий access token
http.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — ловим 401 и пробуем обновить токен
http.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Обновляем access token через refresh endpoint
        const response = await http.post("/api/refresh"); // с HttpOnly cookie
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Обновляем header и повторяем оригинальный запрос
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (refreshErr) {
        // Если refresh не удался — делаем logout или редирект на login
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default http;
