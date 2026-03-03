import { useEffect, useState } from "react";
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
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardRoute = user?.role === "admin" ? "/admin" : "/dashboard";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <section className="landing-page">
      <div className="landing-shell">
        <header className="landing-header">
          <Link to="/" className="landing-logo-link" aria-label="Home">
            <img
              className="landing-logo"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
              alt="logo"
            />
          </Link>

          <nav className="landing-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item} href="#section-main" className="landing-nav-link">
                {item}
              </a>
            ))}
          </nav>

          <div className="landing-actions">
            <Link to="/login" className="landing-pill landing-pill--soft">
              Login
            </Link>
            <Link to="/register" className="landing-pill landing-pill--solid">
              Sign up
            </Link>
          </div>

          <button
            type="button"
            className="landing-menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        <aside className={`landing-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="landing-close-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <nav className="landing-mobile-nav">
            {navItems.map((item) => (
              <a
                key={item}
                href="#section-main"
                className="landing-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link to="/login" className="landing-pill landing-pill--soft" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link
              to="/register"
              className="landing-pill landing-pill--solid"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </Link>
          </nav>
        </aside>

        <main id="section-main" className="landing-main">
          <div className="landing-copy">
            <button type="button" className="landing-badge">
              <span>Explore how we help grow brands.</span>
              <span className="landing-badge-icon">
                <svg width="14" height="11" viewBox="0 0 16 13" fill="none">
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

            <h1 className="landing-title">
              Preferred choice of leaders in <span>every industry</span>
            </h1>

            <p className="landing-subtitle">
              Learn why professionals trust our solution to complete their customer journey.
            </p>

            <div className="landing-cta-row">
              <Link to={dashboardRoute} className="landing-cta landing-cta--primary">
                <span>Read Success Stories</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link to={dashboardRoute} className="landing-cta landing-cta--secondary">
                Get Started
              </Link>
            </div>
          </div>

          <div className="landing-visual" aria-label="Photos of leaders">
            {heroImages.map((url, index) => (
              <img
                key={url}
                className="landing-image"
                src={url}
                alt={`Leader ${index + 1}`}
                loading="lazy"
                width="192"
                height="236"
              />
            ))}
          </div>
        </main>

        <footer className="landing-footer">
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
