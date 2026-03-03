import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminUsers,
  updateAdminUserFlags,
  updateAdminUserRole,
} from "./authService";
import { useAuth } from "./context/useAuth";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navItems = ["Products", "Customer Stories", "Pricing", "Docs"];

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
  const totalVerified = useMemo(
    () => users.filter((user) => user.isVerified).length,
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <section className="admin-ui-page">
      <div className="admin-ui-shell">
        <header className="admin-ui-header">
          <Link to="/" className="admin-ui-logo-link" aria-label="Home">
            <img
              className="admin-ui-logo"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
              alt="logo"
            />
          </Link>

          <nav className="admin-ui-nav">
            {navItems.map((item) => (
              <a key={item} href="#admin-main" className="admin-ui-nav-link">
                {item}
              </a>
            ))}
          </nav>

          <div className="admin-ui-actions">
            <Link to="/" className="admin-ui-pill admin-ui-pill--soft">
              Home
            </Link>
            <button type="button" onClick={logout} className="admin-ui-pill admin-ui-pill--solid">
              Logout
            </button>
          </div>

          <button
            type="button"
            className="admin-ui-menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        <aside className={`admin-ui-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="admin-ui-close-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <nav className="admin-ui-mobile-nav">
            {navItems.map((item) => (
              <a key={item} href="#admin-main" className="admin-ui-mobile-link" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <Link to="/" className="admin-ui-pill admin-ui-pill--soft" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="admin-ui-pill admin-ui-pill--solid"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main id="admin-main" className="admin-ui-main">
          <div className="admin-ui-hero">
            <button type="button" className="admin-ui-badge">
              Platform administration
            </button>
            <h1 className="admin-ui-title">
              Centralized control for <span>users and security</span>
            </h1>
            <p className="admin-ui-subtitle">
              Manage roles, verification status, and account activity from one secure control center.
            </p>
          </div>

          <div className="admin-ui-stats">
            <article className="admin-ui-stat-card">
              <h2>Total Users</h2>
              <p>{totalUsers}</p>
            </article>
            <article className="admin-ui-stat-card">
              <h2>Admin Accounts</h2>
              <p>{totalAdmins}</p>
            </article>
            <article className="admin-ui-stat-card">
              <h2>Verified Users</h2>
              <p>{totalVerified}</p>
            </article>
          </div>

          <section className="admin-ui-panel">
            <div className="admin-ui-panel-head">
              <h2>User Directory</h2>
              <button type="button" onClick={loadUsers} className="admin-ui-refresh-btn">
                Refresh users
              </button>
            </div>

            {isLoading && (
              <p className="admin-ui-loading">
                <span className="admin-ui-spinner" />
                Loading users...
              </p>
            )}
            {error && <p className="admin-ui-error">{error}</p>}

            {!isLoading && (
              <div className="admin-ui-table-wrap">
                <table className="admin-ui-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Verified</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <p className="admin-ui-name">{user.fullName || "No name"}</p>
                          <p className="admin-ui-email">{user.email}</p>
                        </td>
                        <td>
                          <select
                            value={selectedRole[user.id] || user.role}
                            onChange={(event) =>
                              setSelectedRole((prev) => ({ ...prev, [user.id]: event.target.value }))
                            }
                            className="admin-ui-select"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td>
                          <span className={`admin-ui-status ${user.isVerified ? "verified" : "pending"}`}>
                            {user.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-ui-status ${user.isActive ? "active" : "inactive"}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-ui-actions-row">
                            <button type="button" className="admin-ui-action-btn save" onClick={() => handleRoleUpdate(user.id)}>
                              Save
                            </button>
                            <button
                              type="button"
                              className="admin-ui-action-btn warn"
                              onClick={() => handleFlagUpdate(user.id, { isVerified: !user.isVerified })}
                            >
                              {user.isVerified ? "Unverify" : "Verify"}
                            </button>
                            <button
                              type="button"
                              className="admin-ui-action-btn danger"
                              onClick={() => handleFlagUpdate(user.id, { isActive: !user.isActive })}
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
          </section>
        </main>

        <footer className="admin-ui-footer">
          <Link to="/login">Login</Link>
          <span aria-hidden="true">|</span>
          <Link to="/register">Sign up</Link>
          <span aria-hidden="true">|</span>
          <Link to="/verify-email">Verify email</Link>
        </footer>
      </div>
    </section>
  );
}
