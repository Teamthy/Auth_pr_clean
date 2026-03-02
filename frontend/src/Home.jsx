import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="inline-flex w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
        Production Auth Boilerplate
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900">
        Secure authentication with verification codes, refresh tokens, and role-based dashboards.
      </h1>
      <p className="max-w-2xl text-slate-600">
        Register, verify your email, login, reset password, and access your role-specific dashboard.
      </p>
      <div className="flex flex-wrap gap-3">
        {!user && (
          <>
            <Link
              to="/register"
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign in
            </Link>
          </>
        )}
        {user && (
          <Link
            to={user.role === "admin" ? "/admin" : "/dashboard"}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Go to dashboard
          </Link>
        )}
      </div>
    </section>
  );
}
