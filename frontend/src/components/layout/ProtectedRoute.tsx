import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
          <p className="text-sm font-medium text-slate-400 tracking-wider">INITIALIZING MEDIFLOW SECURE SESSION...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your role (<span className="font-semibold text-teal-400">{user.role}</span>) does not have authorization to view this section.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full rounded-xl bg-slate-800 py-2.5 font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
