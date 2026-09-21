import axios from "axios";

const api = axios.create({
  baseURL: "https://plumas-volandot.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Datos de sesión que se limpian cuando el servidor rechaza el token
const SESSION_KEYS = [
  "token",
  "user",
  "employee",
  "loggedUser",
  "loggedEmployee",
  "authUser",
  "loginEmail",
];

// Rutas del frontend que no requieren sesión
const PUBLIC_PATHS = ["/login", "/register", "/recoverEmail", "/emailCode", "/newPass"];

// Endpoints de autenticación: un 401 aquí significa "credenciales incorrectas",
// no "sesión expirada", así que no deben cerrar la sesión ni redirigir.
const AUTH_ENDPOINTS = ["/loginEmployee", "/registerEmployee", "/recoveryPasswordEmployee"];

// Evita que varias peticiones simultáneas (el dashboard lanza varias a la vez)
// disparen la redirección más de una vez.
let isRedirecting = false;

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.startsWith(path));
    const isPublicPage = PUBLIC_PATHS.includes(window.location.pathname);

    if (status === 401 && !isAuthEndpoint && !isPublicPage && !isRedirecting) {
      // Deja rastro de QUÉ petición provocó el cierre de sesión (útil para depurar)
      console.warn(
        "[api] 401 en",
        url,
        "-",
        error.response?.data?.message || "sin mensaje"
      );

      isRedirecting = true;
      SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;