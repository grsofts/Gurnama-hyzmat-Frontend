import http from "./http";

export const UsersService = {
  getUsers: async () => {
    const response = await http.get("/api/users");
    return response.data;
  },
  getUserById: async (id) => {
    const response = await http.get(`/api/users/${id}`);
    return response.data;
  },
};

export default UsersService;