import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="grid gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-cyan-100/70 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-10 left-20 h-36 w-36 rounded-full bg-amber-100/80 blur-2xl"></div>

        <p className="inline-flex w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
          Production Auth Platform
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Secure sign-up, verification, session management, and role-based dashboards.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          End-to-end auth flow with verification codes, forgot/reset password, protected routes,
          and admin controls.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {!user && (
            <>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
            </>
          )}
          {user && (
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Open dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Email Verification</p>
          <p className="mt-2 text-sm text-slate-600">
            New users confirm ownership through one-time codes with expiration.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Token Security</p>
          <p className="mt-2 text-sm text-slate-600">
            Access + refresh strategy with server-side rotation and protected routes.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Admin Controls</p>
          <p className="mt-2 text-sm text-slate-600">
            Manage roles, verification, and account status from one dashboard.
          </p>
        </div>
      </div>
    </section>
  );
}
