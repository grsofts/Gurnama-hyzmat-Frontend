import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const BannersService = {
  getBanners: async () => {
    const response = await http.get(`/api/sliders?lang=${lang}`);
    return response.data;
  },
  getBannerById: async (id) => {
    const response = await http.get(`/api/sliders/${id}?lang=${lang}`);
    return response.data;
  },
  createBanner: async (bannerData) => {
    const response = await http.post(`/api/add_slider`, bannerData, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  setStatus: async (id, status) => {
    const response = await http.put(`/api/slider_status/${id}?status=${status}`);
    return response.data;
  },
  updateBanner: async (id, bannerData) => {
    const response = await http.put(`/api/update_slider/${id}`, bannerData, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await http.delete(`/api/delete_slider/${id}`);
    return response.data;
  },
};

export default BannersService;