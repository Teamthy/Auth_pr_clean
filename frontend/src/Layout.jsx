import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Sign in", to: "/login" },
    { label: "Sign up", to: "/register" },
    { label: "Verify Mail", to: "/verify-email" },
    { label: "Forgot Password", to: "/forgot-password" },
  ];

  const isAuthPage = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);
  const hideHeaderRoutes = ["/", "/admin"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  const sectionClasses = `bg-gradient-to-b from-[#F5F7FF] via-[#fffbee] to-[#E6EFFF] text-slate-900 ${
    menuOpen ? "overflow-hidden" : ""
  }`;

  return (
    <div className={`min-h-screen ${sectionClasses}`}>      
      {!hideHeaderRoutes && (
        <header className="sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-6 w-full">
            <Link to="/">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
                alt="logo"
              />
            </Link>

            {/* navigation (desktop + mobile overlay) */}
            <nav
              className={`md:flex ${
                menuOpen
                  ? "fixed inset-0 w-full bg-white/50 backdrop-blur z-20 flex flex-col items-center justify-center gap-8 text-gray-900 text-sm font-normal transition-all"
                  : "hidden"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="hover:text-indigo-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* mobile actions (login/register or user links) */}
              <div className="flex flex-col items-center gap-3 mt-4 md:hidden">
                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-indigo-600 bg-indigo-100 px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition w-full text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition w-full text-center"
                    >
                      Sign up
                    </Link>
                  </>
                )}
                {user && user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center rounded-full border border-transparent px-3 py-1.5 hover:border-slate-300 hover:bg-white"
                  >
                    Admin
                  </Link>
                )}
                {user && user.role !== "admin" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center rounded-full border border-transparent px-3 py-1.5 hover:border-slate-300 hover:bg-white"
                  >
                    Dashboard
                  </Link>
                )}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
                  >
                    Logout
                  </button>
                )}
              </div>

              <button
                className="md:hidden text-gray-600 absolute top-6 right-6"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </nav>

            <div className="hidden md:flex space-x-4">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-indigo-600 bg-indigo-100 px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Sign up
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
            </div>

            <button
              type="button"
              className="md:hidden text-gray-600"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
      )}
      <main
        className={
          hideHeaderRoutes
            ? "mx-auto w-full max-w-none px-0 py-0"
            : "mx-auto w-full max-w-7xl px-4 py-8"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
