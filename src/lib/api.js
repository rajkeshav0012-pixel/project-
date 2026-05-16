import axios from "axios";

// Hardcoded to point directly to Render backend (bypasses Vercel env var issues)
const BACKEND_URL = "https://ai-study-helper-backend-17c5.onrender.com";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
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
