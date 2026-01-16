import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const CertificateService = {
  getCertificates: async () => {
    const response = await http.get(`/api/certificates?lang=${lang}`);
    return response.data;
  },
  getCertificateById: async (id) => {
    const response = await http.get(`/api/certificates/${id}?lang=${lang}`);
    return response.data;
  },
  createCertificate: async (Data) => {
    const response = await http.post(`/api/add_certificate`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  setStatus: async (id, status) => {
    const response = await http.put(`/api/certificate_status/${id}?status=${status}`);
    return response.data;
  },
  updateCertificate: async (id, Data) => {
    const response = await http.put(`/api/update_certificate/${id}`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deleteCertificate: async (id) => {
    const response = await http.delete(`/api/delete_certificate/${id}`);
    return response.data;
  },
};

export default CertificateService;