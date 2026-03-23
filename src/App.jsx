import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

// Protected route — redirects to /login if no token in localStorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: "40px 48px" }}
      >
        {/* Ambient background blobs */}
        <div
          className="fixed top-0 left-72 right-0 bottom-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
              animationDelay: "1.2s",
            }}
          />
        </div>

        {/* Page content */}
        <div className="relative" style={{ zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
