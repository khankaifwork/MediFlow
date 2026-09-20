import { useState } from "react";
import { login } from "../../services/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import {
  Activity,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      await loginUser(data.access_token);
      toast.success("Welcome back to MediFlow!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials. Please verify username and password.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(userRole: "admin" | "pharmacist") {
    if (userRole === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("pharmacist");
      setPassword("pharma123");
    }
    toast("Demo credentials populated!", { icon: "🔑" });
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Left Column: Brand Hero */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/30 p-12 lg:flex">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Medi<span className="text-teal-400">Flow</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400/80">
              Pharmacy OS & Intelligence
            </p>
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Pharmacy Management v1.0</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Smarter Dispensing. Real-Time Insights.
          </h2>

          <p className="text-base text-slate-400 leading-relaxed">
            Engineered for modern pharmacies and retail hospital dispensaries.
            Experience lightning-fast POS checkouts, automated batch tracking,
            and predictive Gemini AI assistants.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-xs text-slate-400 mt-1">Dispensing Accuracy</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-teal-400">Zero Lag</p>
              <p className="text-xs text-slate-400 mt-1">Instant Multi-Cart POS</p>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>Encrypted JWT Sessions • Role-Based RBAC • Production Ready</span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div>
            <div className="flex items-center gap-3 lg:hidden mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950">
                <Activity className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                Medi<span className="text-teal-400">Flow</span>
              </span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-white">
              Sign In to Your Station
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Enter your credentials to access inventory, sales, and analytics.
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Demo Fill:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex-1 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition active:scale-95"
              >
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => fillDemo("pharmacist")}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition active:scale-95"
              >
                Pharmacist (Staff)
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. admin"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/35 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Protected under MediFlow Core Security • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}