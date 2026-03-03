import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isSplitAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-app-gradient text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            AuthProd
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-transparent px-3 py-1.5 hover:border-slate-300 hover:bg-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-slate-300 px-3 py-1.5 hover:bg-white"
                >
                  Register
                </Link>
              </>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-full border border-transparent px-3 py-1.5 hover:border-slate-300 hover:bg-white"
              >
                Admin
              </Link>
            )}
            {user && user.role !== "admin" && (
              <Link
                to="/dashboard"
                className="rounded-full border border-transparent px-3 py-1.5 hover:border-slate-300 hover:bg-white"
              >
                Dashboard
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main
        className={
          isSplitAuthPage
            ? "mx-auto w-full max-w-7xl px-0 py-0"
            : "mx-auto w-full max-w-7xl px-4 py-8"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
