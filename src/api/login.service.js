import http from "./http";


export const LoginService = {
  login: async (body) => {
    const response = await http.post("/api/login", body, { withCredentials: true });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  },
  me: async () => {
    const response = await http.get("/api/me", { withCredentials: true, headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
    return response.data;
  },
};

export default LoginService;