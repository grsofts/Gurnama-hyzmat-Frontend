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
  createUser: async (Data) => {
    const response = await http.post(`/api/register`, Data);
    return response.data;
  },
  updateUser: async (Data, id, who) => {
    const response = await http.put(`/api/users/${id}?who=${who}`, Data);
    return response.data;
  },
  deleteUser: async (id) => {
    const resp = await http.delete(`/api/users/${id}`);
    return resp.data;
  }
};

export default UsersService;