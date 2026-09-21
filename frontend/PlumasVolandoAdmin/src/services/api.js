import axios from "axios";

const api = axios.create({
  // [CORREGIDO] Se agregó '/api' al final de la URL
  baseURL: "https://plumas-volandot.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;