import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";

const heroImages = [
  "https://images.unsplash.com/photo-1614289371518-722f2615943d?auto=format&fit=crop&w=520&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=520&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=520&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80",
];

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <section className="min-h-screen bg-[#f1f4fb] px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex w-full max-w-[1820px] flex-col rounded-xl border border-slate-200 bg-[#edf1f8] p-5 sm:p-8 lg:p-9">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200 bg-white">
            <img src="/logo.png" alt="logo" className="h-full w-full object-cover" />
          </div>

          <nav className="hidden items-center justify-center gap-10 text-[28px] md:flex md:text-[17px]">
            <a href="#" className="text-slate-700 hover:text-slate-900">
              Products
            </a>
            <a href="#" className="text-slate-700 hover:text-slate-900">
              Customer Stories
            </a>
            <a href="#" className="text-slate-700 hover:text-slate-900">
              Pricing
            </a>
            <a href="#" className="text-slate-700 hover:text-slate-900">
              Docs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={user?.role === "admin" ? "/admin" : "/dashboard"}
              className="rounded-full bg-[#dce3fb] px-6 py-2 text-sm font-semibold text-indigo-600"
            >
              {user?.role === "admin" ? "Dashboard" : "Profile"}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-[#4f46e5] px-6 py-2 text-sm font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 pb-4 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-8 lg:pt-16">
          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#4f46e5] px-6 py-2 text-sm font-medium text-[#4f46e5]"
            >
              Explore how we help grow brands.
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#4f46e5] text-white">
                →
              </span>
            </button>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] text-[#0f172a] sm:text-6xl lg:text-7xl">
              Preferred choice of
              <br />
              leaders in <span className="text-[#4f46e5]">every</span>
              <br />
              <span className="text-[#4f46e5]">industry</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Learn why professionals trust our solution to complete their customer journey.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-3 rounded-full bg-[#4f46e5] px-8 py-3 text-base font-semibold text-white"
              >
                Read Success Stories
                <span className="text-xl">→</span>
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full bg-[#dde3f9] px-8 py-3 text-base font-semibold text-[#4f46e5]"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4 sm:gap-6">
            {heroImages.map((imageUrl, index) => (
              <div
                key={imageUrl}
                className={`overflow-hidden rounded-2xl shadow-[0_14px_40px_-26px_rgba(15,23,42,0.45)] ${
                  index % 2 === 0 ? "mt-0" : "mt-4 sm:mt-6"
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`customer-${index + 1}`}
                  className="h-[220px] w-full object-cover sm:h-[280px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
