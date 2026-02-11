import http from "./http";

const lang = localStorage.getItem("lang") || "tm";

export const ProjectService = {
  getProjects: async () => {
    const response = await http.get(`/api/projects?lang=${lang}`);
    return response.data;
  },
  getProjectById: async (id) => {
    const response = await http.get(`/api/projects/${id}`);
    return response.data;
  },
  createProject: async (Data) => {
    const response = await http.post(`/api/add_project`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  setStatus: async (id, status) => {
    const response = await http.put(`/api/project_status/${id}?status=${status}`);
    return response.data;
  },
  updateProject: async (id, Data) => {
    const response = await http.put(`/api/update_project/${id}`, Data, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await http.delete(`/api/delete_project/${id}`);
    return response.data;
  },
};

export default ProjectService;