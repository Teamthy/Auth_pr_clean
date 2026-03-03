import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Profile() {
  const { user, syncProfile } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
          <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">{user.role}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Email Verified</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {user.isVerified ? "Yes" : "No"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Account Status</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {user.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">User Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">View your account and security details.</p>

        <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">Full name</dt>
            <dd className="mt-1 text-base text-slate-900">{user.fullName || "Not set"}</dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-base text-slate-900">{user.email}</dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">User ID</dt>
            <dd className="mt-1 break-all text-base text-slate-900">{user.id}</dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">Joined</dt>
            <dd className="mt-1 text-base text-slate-900">
              {new Date(user.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={syncProfile}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh profile
          </button>
          <Link
            to="/forgot-password"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Change password
          </Link>
        </div>
      </div>
    </section>
  );
}
