import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

const heroImages = [
  "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=735&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=687&auto=format&fit=crop",
];

const navItems = ["Products", "Customer Stories", "Pricing", "Docs"];

export default function Home() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardRoute = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <section className="min-h-screen bg-[#edf2ff] px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto min-h-[92vh] w-full max-w-[1840px] rounded-xl border border-slate-200 bg-gradient-to-b from-[#f6f8ff] via-[#f8f8f6] to-[#e6eeff] px-5 sm:px-8 lg:px-14">
        <header className="relative flex items-center justify-between py-6 lg:py-7">
          <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200 bg-white">
            <img src="/logo.png" alt="logo" className="h-full w-full object-cover" />
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 text-sm text-slate-800 md:flex">
            {navItems.map((item) => (
              <button key={item} type="button" className="transition hover:text-indigo-600">
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to={dashboardRoute}
              className="rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-200"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Sign out
            </button>
          </div>

          <button
            type="button"
            className="text-slate-700 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute inset-x-0 top-0 z-20 rounded-b-2xl border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur md:hidden">
              <div className="mb-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col items-center gap-4 text-sm text-slate-800">
                {navItems.map((item) => (
                  <button key={item} type="button" className="hover:text-indigo-600">
                    {item}
                  </button>
                ))}
              </nav>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  to={dashboardRoute}
                  className="rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="mx-auto grid w-full max-w-7xl items-center gap-12 pb-14 pt-8 md:grid-cols-[1fr_auto] md:pt-12 lg:gap-24 lg:pt-16">
          <div className="mx-auto flex w-full max-w-[620px] flex-col items-center md:items-start md:text-left">
            <button
              type="button"
              className="mb-6 mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-600 px-4 py-1.5 pr-1.5 text-xs text-indigo-600 transition hover:bg-indigo-50"
            >
              <span>Explore how we help grow brands.</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                <svg width="14" height="11" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 6.5h14M9.5 1 15 6.5 9.5 12"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <h1 className="max-w-xl text-center text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl md:text-left lg:text-[4.1rem]">
              Preferred choice of
              <br className="hidden sm:block" />
              leaders in{" "}
              <span className="text-indigo-600">
                every
                <br className="hidden sm:block" />
                industry
              </span>
            </h1>

            <p className="mt-5 max-w-[32rem] text-center text-base leading-relaxed text-slate-600 md:text-left">
              Learn why professionals trust our solution to complete their customer journey.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                to={dashboardRoute}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Read Success Stories
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                to={dashboardRoute}
                className="rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-200"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div aria-label="Photos of leaders" className="mx-auto mt-8 grid grid-cols-2 gap-6 pb-6 md:mt-0">
            {heroImages.map((imageUrl) => (
              <img
                key={imageUrl}
                alt="leader"
                src={imageUrl}
                className="h-44 w-36 rounded-lg object-cover shadow-lg transition duration-300 hover:scale-105 sm:h-48 sm:w-40 lg:h-52 lg:w-44"
              />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
