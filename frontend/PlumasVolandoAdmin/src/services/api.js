import axios from "axios"

const api = axios.create({
    baseURL: "https://plumas-volandot.onrender.com",
    withCredentials: true,
});

export default api;