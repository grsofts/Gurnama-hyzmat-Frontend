import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const SettingService = {
  getAbout: async () => {
    const response = await http.get(`/api/about?lang=${lang}`);
    return response.data;
  },
  getAllAbout: async () => {
    const response = await http.get(`/api/about`);
    return response.data;
  },
  getContacts: async () => {
    const response = await http.get(`/api/contacts`);
    return response.data;
  },
  
  createContact: async (Data) => {
    const response = await http.post(`/api/add_contact`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  updateAbout: async (Data) => {
    const response = await http.put(`/api/update_about`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  updateContact: async (id, Data) => {
    const response = await http.put(`/api/update_contact/${id}`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deleteContact: async (id) => {
    const response = await http.delete(`/api/delete_contact/${id}`);
    return response.data;
  },
};

export default SettingService;