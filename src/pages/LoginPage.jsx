import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlowingEffect from "../components/GlowingEffect";
import { authAPI } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "1s",
        }}
      />

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              boxShadow: "0 8px 30px rgba(139, 92, 246, 0.3)",
            }}
          >
            🧠
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <GlowingEffect
            blur={16}
            spread={30}
            glow={false}
            disabled={false}
            borderWidth={1}
            movementDuration={2.5}
            className="rounded-2xl"
          >
            <div className="glass-card" style={{ padding: "36px" }}>
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-5">
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ✉️
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      className="dark-input w-full"
                      style={{ paddingLeft: "44px" }}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      🔒
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className="dark-input w-full"
                      style={{ paddingLeft: "44px", paddingRight: "44px" }}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                      style={{
                        color: "var(--text-muted)",
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "var(--accent-purple)" }}
                    />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "var(--accent-purple)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-purple)")}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    className="mb-4 px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      color: "#ef4444",
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="btn-gradient w-full flex items-center justify-center gap-2 text-base"
                  style={{
                    padding: "14px",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span> Signing in...
                    </>
                  ) : (
                    <>Sign In →</>
                  )}
                </button>
              </form>


            </div>
          </GlowingEffect>
        </div>

        {/* Register Link */}
        <p
          className="text-center mt-6 text-sm animate-fade-in-up"
          style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold transition-colors duration-200"
            style={{ color: "var(--accent-purple)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-purple)")}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
