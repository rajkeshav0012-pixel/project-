import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ProgressPage from "./pages/ProgressPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Sidebar />
        <div
          className="flex-1 p-8 overflow-y-auto"
          style={{
            background: "var(--bg-primary)",
            minHeight: "100vh",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
