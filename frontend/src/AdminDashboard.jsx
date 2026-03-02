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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="text-3xl font-semibold text-slate-900">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Admin accounts</p>
          <p className="text-3xl font-semibold text-slate-900">{totalAdmins}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Admin dashboard</h1>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-600">Loading users...</p>}
        {error && <p className="mb-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Verified</th>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-900">{user.fullName || "No name"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={selectedRole[user.id] || user.role}
                        onChange={(event) =>
                          setSelectedRole((prev) => ({ ...prev, [user.id]: event.target.value }))
                        }
                        className="rounded-md border border-slate-300 px-2 py-1"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">{user.isVerified ? "Yes" : "No"}</td>
                    <td className="px-3 py-3">{user.isActive ? "Yes" : "No"}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleRoleUpdate(user.id)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
                        >
                          Save role
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleFlagUpdate(user.id, { isVerified: !user.isVerified })
                          }
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
                        >
                          Toggle verify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFlagUpdate(user.id, { isActive: !user.isActive })}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
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
