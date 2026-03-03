import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminUsers,
  updateAdminUserFlags,
  updateAdminUserRole,
} from "./authService";
import { useAuth } from "./context/useAuth";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const isMountedRef = useRef(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState(null);
  const [error, setError] = useState("");

  const navItems = ["Products", "Customer Stories", "Pricing", "Docs"];

  const getErrorMessage = useCallback(
    (err, fallbackMessage) =>
      err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || fallbackMessage,
    []
  );

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAdminUsers();
      const normalizedUsers = Array.isArray(data) ? data : [];
      const roleMap = {};
      normalizedUsers.forEach((user) => {
        roleMap[user.id] = user.role;
      });
      if (!isMountedRef.current) {
        return;
      }
      setUsers(normalizedUsers);
      setSelectedRole(roleMap);
    } catch (err) {
      if (isMountedRef.current) {
        setError(getErrorMessage(err, "Failed to load users."));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [getErrorMessage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
    if (activeUserId) {
      return;
    }
    const role = selectedRole[userId];
    setActiveUserId(userId);
    setError("");
    try {
      const updatedUser = await updateAdminUserRole(userId, role);
      if (isMountedRef.current) {
        setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(getErrorMessage(err, "Failed to update role."));
      }
    } finally {
      if (isMountedRef.current) {
        setActiveUserId(null);
      }
    }
  }

  async function handleFlagUpdate(userId, payload) {
    if (activeUserId) {
      return;
    }
    setActiveUserId(userId);
    setError("");
    try {
      const updatedUser = await updateAdminUserFlags(userId, payload);
      if (isMountedRef.current) {
        setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(getErrorMessage(err, "Failed to update user."));
      }
    } finally {
      if (isMountedRef.current) {
        setActiveUserId(null);
      }
    }
  }

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
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
            aria-controls="admin-mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        <aside
          id="admin-mobile-menu"
          className={`admin-ui-mobile-menu ${menuOpen ? "is-open" : ""}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setMenuOpen(false);
            }
          }}
        >
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
              <button type="button" onClick={loadUsers} className="admin-ui-refresh-btn" disabled={isLoading}>
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
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5">
                          <p className="admin-ui-empty">No users found.</p>
                        </td>
                      </tr>
                    )}
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
                            <button
                              type="button"
                              className="admin-ui-action-btn save"
                              disabled={
                                Boolean(activeUserId) || (selectedRole[user.id] || user.role) === user.role
                              }
                              onClick={() => handleRoleUpdate(user.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="admin-ui-action-btn warn"
                              disabled={Boolean(activeUserId)}
                              onClick={() => handleFlagUpdate(user.id, { isVerified: !user.isVerified })}
                            >
                              {user.isVerified ? "Unverify" : "Verify"}
                            </button>
                            <button
                              type="button"
                              className="admin-ui-action-btn danger"
                              disabled={Boolean(activeUserId)}
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
