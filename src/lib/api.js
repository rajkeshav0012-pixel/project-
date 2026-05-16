import axios from "axios";

// In dev: VITE_API_URL is empty → uses Vite proxy → hits localhost:5000
// In prod: VITE_API_URL = "https://your-backend.onrender.com" (set in Vercel env vars)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ── Chat ──────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message, history) => api.post("/chat", { message, history }),
  getHistory: () => api.get("/chat/history"),
};

// ── Upload ────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Progress ──────────────────────────────────────────────────────────
export const progressAPI = {
  getProgress: () => api.get("/progress"),
  updateSubject: (subject, data) => api.put(`/progress/${subject}`, data),
  addSubject: (data) => api.post("/progress/subject", data),
  removeSubject: (subject) => api.delete(`/progress/subject/${subject}`),
};

export default api;
