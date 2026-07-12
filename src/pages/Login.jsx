import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { roles } from "../data/mockData";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAppData();
  const [email, setEmail] = useState("manager@transitops.io");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    signIn(role);
    navigate("/dashboard");
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
                One login, four roles:
              </h2>
              <ul className="space-y-4">
                {roles.map((r) => (
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

        {/* Right Panel: Sign-in Form */}
        <section className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="font-display text-display text-on-surface mb-2">Sign in to your account</h2>
              <p className="font-body-md text-body-md text-secondary">Enter your credentials to continue</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor="email">
                  EMAIL
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none"
                  id="email"
                  placeholder="manager@transitops.io"
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
                <label className="font-body-md text-body-md text-on-surface font-semibold uppercase" htmlFor="role">
                  Role Selection
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md outline-none appearance-none cursor-pointer"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {roles.map((r) => (
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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary-container cursor-pointer"
                    type="checkbox"
                  />
                  <span className="font-body-md text-body-md text-secondary group-hover:text-on-surface transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  className="font-body-md text-body-md text-primary font-semibold hover:underline decoration-primary-container"
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary-fixed font-bold py-4 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Sign In
              </button>
            </form>
            <div className="mt-12 p-6 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-secondary mb-4 opacity-70">
                Access is scoped by role after login:
              </p>
              <ul className="space-y-2 font-body-md text-[13px] text-secondary leading-relaxed">
                <li>
                  • <strong className="text-on-surface">Fleet Manager</strong> – Fleet, Maintenance
                </li>
                <li>
                  • <strong className="text-on-surface">Dispatcher</strong> – Dashboard, Trips
                </li>
                <li>
                  • <strong className="text-on-surface">Safety Officer</strong> – Drivers, Compliance
                </li>
                <li>
                  • <strong className="text-on-surface">Financial Analyst</strong> – Fuel & Expenses, Analytics
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
