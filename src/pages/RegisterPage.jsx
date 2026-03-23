import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlowingEffect from "../components/GlowingEffect";
import { authAPI } from "../lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordStrength = () => {
    if (!password) return { label: "", color: "", width: "0%" };
    if (password.length < 6)
      return { label: "Weak", color: "#ef4444", width: "33%" };
    if (password.length < 10)
      return { label: "Medium", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "var(--accent-green)", width: "100%" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "1s",
        }}
      />

      <div className="w-full max-w-md px-6 relative z-10 py-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
              boxShadow: "0 8px 30px rgba(236, 72, 153, 0.3)",
            }}
          >
            🚀
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Start your AI-powered learning journey today
          </p>
        </div>

        {/* Register Form */}
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
                {/* Full Name */}
                <div className="mb-4">
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      👤
                    </span>
                    <input
                      id="register-name"
                      type="text"
                      className="dark-input w-full"
                      style={{ paddingLeft: "44px" }}
                      placeholder="Keshav Raj"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="register-email"
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
                      id="register-email"
                      type="email"
                      className="dark-input w-full"
                      style={{ paddingLeft: "44px" }}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label
                    htmlFor="register-password"
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
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      className="dark-input w-full"
                      style={{ paddingLeft: "44px", paddingRight: "44px" }}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  {/* Password Strength */}
                  {password && (
                    <div className="mt-2">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: strength.width,
                            background: strength.color,
                          }}
                        />
                      </div>
                      <p
                        className="text-xs mt-1 text-right"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      🔐
                    </span>
                    <input
                      id="register-confirm-password"
                      type="password"
                      className="dark-input w-full"
                      style={{
                        paddingLeft: "44px",
                        borderColor:
                          confirmPassword && confirmPassword !== password
                            ? "#ef4444"
                            : undefined,
                      }}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPassword && confirmPassword === password && (
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base"
                      >
                        ✅
                      </span>
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                      Passwords don&apos;t match
                    </p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded mt-0.5"
                    style={{ accentColor: "var(--accent-purple)" }}
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    I agree to the{" "}
                    <a href="#" style={{ color: "var(--accent-purple)" }}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" style={{ color: "var(--accent-purple)" }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>

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
                  id="register-submit-btn"
                  type="submit"
                  className="btn-gradient w-full flex items-center justify-center gap-2 text-base"
                  style={{
                    padding: "14px",
                    opacity: isLoading ? 0.7 : 1,
                    background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span> Creating account...
                    </>
                  ) : (
                    <>Create Account 🚀</>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  or sign up with
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
              </div>

              {/* Social Register */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="register-google-btn"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <span>🔴</span>
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  id="register-github-btn"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <span>⚫</span>
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>
            </div>
          </GlowingEffect>
        </div>

        {/* Login Link */}
        <p
          className="text-center mt-6 text-sm animate-fade-in-up"
          style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold transition-colors duration-200"
            style={{ color: "var(--accent-purple)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-purple)")}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
