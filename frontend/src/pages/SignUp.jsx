import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

const ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAppData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password, role);
    setLoading(false);

    if (result.ok) {
      setSuccess(result.message || "Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.error || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <main className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white overflow-hidden rounded-lg login-card-shadow min-h-[600px]">
        {/* Left Panel: Brand & Identity */}
        <section className="w-full md:w-5/12 bg-inverse-surface text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="material-symbols-outlined text-primary-container text-[40px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight">TransitOps</h1>
            </div>
            <p className="font-body-lg text-body-lg text-on-secondary-fixed-variant mb-12 opacity-80">
              Smart Transport Operations Platform
            </p>
            <div className="space-y-6">
              <h2 className="font-label-caps text-label-caps text-primary-container uppercase tracking-widest">
                Join as one of four roles:
              </h2>
              <ul className="space-y-4">
                {ROLES.map((r) => (
                  <li key={r} className="flex items-center gap-3 font-body-md text-body-md">
                    <span className="material-symbols-outlined text-primary-container text-sm">fiber_manual_record</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative z-10 pt-12 border-t border-white/10 mt-auto">
            <p className="font-mono-data text-mono-data opacity-50">TRANSITOPS © 2026 • RBAC ENABLED</p>
          </div>
        </section>

        {/* Right Panel: Sign-up Form */}
        <section className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="font-display text-display text-on-surface mb-2">Create your account</h2>
              <p className="font-body-md text-body-md text-secondary">Join TransitOps and start managing operations</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor="name">
                  FULL NAME
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor="email">
                  EMAIL
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none"
                  id="email"
                  placeholder="john@transitops.io"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor="password">
                  PASSWORD
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor="confirmPassword">
                  CONFIRM PASSWORD
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold uppercase" htmlFor="role">
                  Select Your Role
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none appearance-none cursor-pointer"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>
              {error && (
                <div className="bg-error-container text-error px-3 py-2 rounded border border-error/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span className="font-body-md text-[12px] font-bold">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded border border-green-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span className="font-body-md text-[12px] font-bold">{success}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-fixed font-bold py-4 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Creating Account...</>
                ) : "Create Account"}
              </button>
              
              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="font-body-md text-body-md text-secondary">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary font-semibold hover:underline decoration-primary-container"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
