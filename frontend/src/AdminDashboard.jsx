import { useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  updateAdminUserFlags,
  updateAdminUserRole,
} from "./authService";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAdminUsers();
      setUsers(data);
      const roleMap = {};
      data.forEach((user) => {
        roleMap[user.id] = user.role;
      });
      setSelectedRole(roleMap);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const totalUsers = useMemo(() => users.length, [users]);
  const totalAdmins = useMemo(
    () => users.filter((user) => user.role === "admin").length,
    [users]
  );

  async function handleRoleUpdate(userId) {
    const role = selectedRole[userId];
    try {
      const updatedUser = await updateAdminUserRole(userId, role);
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update role.");
    }
  }

  async function handleFlagUpdate(userId, payload) {
    try {
      const updatedUser = await updateAdminUserFlags(userId, payload);
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user.");
    }
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Admin Accounts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalAdmins}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Standard Users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalUsers - totalAdmins}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Manage users, roles, and account state.</p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-600">Loading users...</p>}
        {error && <p className="mb-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {!isLoading && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="bg-white hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{user.fullName || "No name"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={selectedRole[user.id] || user.role}
                        onChange={(event) =>
                          setSelectedRole((prev) => ({ ...prev, [user.id]: event.target.value }))
                        }
                        className="rounded-full border border-slate-300 px-3 py-1.5"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isVerified
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isActive ? "bg-cyan-100 text-cyan-700" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleRoleUpdate(user.id)}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Save role
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleFlagUpdate(user.id, { isVerified: !user.isVerified })
                          }
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Toggle verify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFlagUpdate(user.id, { isActive: !user.isActive })}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Toggle active
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
