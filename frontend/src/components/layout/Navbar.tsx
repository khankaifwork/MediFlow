import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Activity,
  LogOut,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    toast.success("Signed out successfully.");
    navigate("/login");
  }

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
      {/* Brand & System Status */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/20 transition group-hover:scale-105">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Medi<span className="text-teal-600">Flow</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-50/60 px-3 py-1 text-xs font-semibold text-teal-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
          </span>
          <span>System Online • v1.0 Production</span>
        </div>
      </div>

      {/* Right Controls: AI Quick Link & Profile Menu */}
      <div className="flex items-center gap-3">
        <Link
          to="/ai"
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-700 hover:from-teal-500/20 hover:to-cyan-500/20 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          <span>AI Intelligence</span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 pr-3 text-left transition hover:bg-slate-100/80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">
                {user?.full_name || "System Admin"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="h-3 w-3 text-teal-600" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {user?.role || "Admin"}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-200/50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                <p className="truncate text-sm font-bold text-slate-900">{user?.email || "admin@mediflow.com"}</p>
                <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 uppercase">
                  {user?.role || "Administrator"}
                </span>
              </div>

              <div className="py-1">
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>Username: <strong>{user?.username || "admin"}</strong></span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}