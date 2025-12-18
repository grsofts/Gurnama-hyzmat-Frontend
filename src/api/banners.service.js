import http from "./http";

export const BannersService = {
  getBanners: async () => {
    const response = await http.get("/api/sliders?lang=tm");
    return response.data;
  },
  getBannerById: async (id) => {
    const response = await http.get(`/api/sliders/${id}`);
    return response.data;
  },
};

export default BannersService;