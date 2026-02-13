import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const PartnerService = {
  getPartners: async () => {
    const response = await http.get(`/api/partners?lang=${lang}`);
    return response.data;
  },
  getPartnerById: async (id) => {
    const response = await http.get(`/api/partners/${id}`);
    return response.data;
  },
  createPartner: async (Data) => {
    const response = await http.post(`/api/add_partner`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  setStatus: async (id, status) => {
    const response = await http.put(`/api/partner_status/${id}?status=${status}`);
    return response.data;
  },
  updatePartner: async (id, Data) => {
    const response = await http.put(`/api/update_partner/${id}`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deletePartner: async (id) => {
    const response = await http.delete(`/api/delete_partner/${id}`);
    return response.data;
  },
};

export default PartnerService;