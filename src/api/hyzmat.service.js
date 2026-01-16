import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const HyzmatService = {
  getServices: async () => {
    const response = await http.get(`/api/services?lang=${lang}`);
    return response.data;
  },
  getServiceById: async (id) => {
    const response = await http.get(`/api/services/${id}?lang=${lang}`);
    return response.data;
  },
  createService: async (Data) => {
    const response = await http.post(`/api/add_service`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  setStatus: async (id, status) => {
    const response = await http.put(`/api/service_status/${id}?status=${status}`);
    return response.data;
  },
  updateService: async (id, Data) => {
    const response = await http.put(`/api/update_service/${id}`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deleteService: async (id) => {
    const response = await http.delete(`/api/delete_service/${id}`);
    return response.data;
  },
};

export default HyzmatService;