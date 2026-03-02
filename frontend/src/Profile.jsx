import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Profile() {
  const { user, syncProfile } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">User dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Account details and security status.</p>
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <dt className="font-medium text-slate-500">Full name</dt>
            <dd>{user.fullName || "Not set"}</dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <dt className="font-medium text-slate-500">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <dt className="font-medium text-slate-500">Role</dt>
            <dd className="capitalize">{user.role}</dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <dt className="font-medium text-slate-500">Email verified</dt>
            <dd>{user.isVerified ? "Yes" : "No"}</dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <dt className="font-medium text-slate-500">Status</dt>
            <dd>{user.isActive ? "Active" : "Inactive"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={syncProfile}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh profile
          </button>
          <Link
            to="/forgot-password"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Change password
          </Link>
        </div>
      </div>
    </section>
  );
}
