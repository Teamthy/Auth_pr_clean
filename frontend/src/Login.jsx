import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";
import { validators } from "./validators";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const signInWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse?.access_token) {
          setError("Google authentication failed.");
          return;
        }
        const user = await googleLogin(tokenResponse.access_token);
        const fallbackRoute = user.role === "admin" ? "/admin" : "/";
        const nextRoute = location.state?.from?.pathname || fallbackRoute;
        navigate(nextRoute, { replace: true });
      } catch (err) {
        const message = err.response?.data?.error || "Google sign-in failed.";
        setError(message);
      }
    },
    onError: () => setError("Google sign-in failed."),
  });

  function validateForm() {
    const errors = {};
    const emailError = validators.email(email);
    const passwordError = password ? null : "Password is required";

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      const fallbackRoute = user.role === "admin" ? "/admin" : "/";
      const nextRoute = location.state?.from?.pathname || fallbackRoute;
      navigate(nextRoute, { replace: true });
    } catch (err) {
      const message = err.response?.data?.error || "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageWrapper imageUrl="/leftSideImage.png" imageAlt="leftSideImage">
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-sub">
          Welcome back! Please sign in to continue
        </p>

        <button
          type="button"
          className="social-btn"
          onClick={() => hasGoogleClientId && signInWithGoogle()}
          disabled={!hasGoogleClientId || isSubmitting}
          title={
            hasGoogleClientId
              ? "Continue with Google"
              : "Set VITE_GOOGLE_CLIENT_ID in frontend/.env to enable Google Auth"
          }
        >
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
            alt="googleLogo"
          />
        </button>

        <div className="divider-row">
          <div className="divider-line"></div>
          <p className="divider-text">or sign in with email</p>
          <div className="divider-line"></div>
        </div>

        <div className="input-wrap">
          <svg
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email id"
            className="input-field"
            required
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.email}</p>
        )}

        <div className="mt-6 input-wrap">
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
        </div>
        {validationErrors.password && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.password}</p>
        )}

        <div className="checkbox-row">
          <div className="flex items-center gap-2">
            <input className="checkbox-input" type="checkbox" id="remember-me" />
            <label className="checkbox-label" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="underline-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary btn-primary--indigo">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
        <p className="footer-text">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="footer-link">
            Sign up
          </Link>
        </p>

        {error && <p className="auth-info auth-info--error">{error}</p>}
      </form>
    </AuthPageWrapper>
  );
}
