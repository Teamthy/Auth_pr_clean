import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-app-gradient text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            AuthProd
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
            {!user && (
              <>
                <Link to="/login" className="hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="hover:text-slate-900">
                  Register
                </Link>
              </>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin" className="hover:text-slate-900">
                Admin
              </Link>
            )}
            {user && user.role !== "admin" && (
              <Link to="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={logout}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
