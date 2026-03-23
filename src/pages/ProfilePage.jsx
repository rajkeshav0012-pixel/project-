import { useState, useEffect } from "react";
import { authAPI, logout } from "../lib/api";
import GlowingEffect from "../components/GlowingEffect";

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setIsSaving(true);

    try {
      const { data } = await authAPI.updateProfile({ name });
      
      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setSuccessMsg("Profile updated successfully! ✨");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
      
      // Force a reload of the sidebar to reflect new name by dispatching a custom event
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">My Profile</span> 👤
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage your account settings and log out.
        </p>
      </div>

      <div className="max-w-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <GlowingEffect blur={15} spread={30} glow={false} disabled={false} borderWidth={1} className="rounded-2xl">
          <div className="glass-card" style={{ padding: "32px" }}>

            {successMsg && (
              <div
                className="mb-6 p-4 rounded-xl text-sm font-medium border"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "var(--accent-green)",
                  borderColor: "rgba(16, 185, 129, 0.2)",
                }}
              >
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                className="mb-6 p-4 rounded-xl text-sm font-medium border"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                  Email Address
                </label>
                <div
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  {user?.email || "Unknown Email"}
                </div>
              </div>

              {/* Name (Editable) */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving || name.trim() === user?.name}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300"
                style={{
                  background: "var(--text-primary)",
                  color: "var(--bg-primary)",
                  opacity: isSaving || name.trim() === user?.name ? 0.5 : 1,
                  cursor: isSaving || name.trim() === user?.name ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <div className="my-8 border-b" style={{ borderColor: "var(--border-subtle)" }} />

            {/* Logout Section */}
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">Account Actions</h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Logging out will terminate your current session on this device.
              </p>
              <button
                onClick={() => logout()}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300 border hover:bg-red-400/10"
                style={{
                  color: "#ef4444",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                }}
              >
                🚪 Log Out
              </button>
            </div>

          </div>
        </GlowingEffect>
      </div>
    </div>
  );
}
