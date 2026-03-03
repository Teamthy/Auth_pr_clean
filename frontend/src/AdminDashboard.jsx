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
    <div className="page-container">
      <div className="page-header mb-6">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage users, roles, and account state.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="stat-card">
          <p className="stat-card-label">Total Users</p>
          <p className="stat-card-value">{totalUsers}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Admin Accounts</p>
          <p className="stat-card-value">{totalAdmins}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Standard Users</p>
          <p className="stat-card-value">{totalUsers - totalAdmins}</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={loadUsers}
            className="btn-sm"
          >
            Refresh Users
          </button>
        </div>

        {isLoading && <p className="loading-text"><span className="spinner mr-2"></span>Loading users...</p>}
        {error && <p className="auth-info auth-info--error mb-4">{error}</p>}

        {!isLoading && (
          <div className="table-wrapper">
            <table className="min-w-full text-sm">
              <thead className="table-header">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <p className="table-body-name">{user.fullName || "No name"}</p>
                      <p className="table-body-email">{user.email}</p>
                    </td>
                    <td>
                      <select
                        value={selectedRole[user.id] || user.role}
                        onChange={(event) =>
                          setSelectedRole((prev) => ({ ...prev, [user.id]: event.target.value }))
                        }
                        className="select-custom"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${user.isVerified ? "badge--success" : "badge--warning"}`}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? "badge--success" : "badge--danger"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          onClick={() => handleRoleUpdate(user.id)}
                          className="btn-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleFlagUpdate(user.id, { isVerified: !user.isVerified })
                          }
                          className="btn-sm"
                        >
                          {user.isVerified ? "Unverify" : "Verify"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFlagUpdate(user.id, { isActive: !user.isActive })}
                          className="btn-sm"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
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
    </div>
  );
}
