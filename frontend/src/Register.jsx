import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";
import PasswordSecurityChecks from "./PasswordSecurityChecks";
import { getGoogleClientId } from "./googleAuthConfig";
import { validators } from "./validators";

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasGoogleClientId = Boolean(getGoogleClientId());

  function resolveErrorMessage(err, fallbackMessage) {
    const validationMessage = err.response?.data?.errors?.[0]?.msg;
    if (validationMessage) {
      return validationMessage;
    }
    if (err.code === "ERR_NETWORK") {
      return "Cannot reach server. Ensure backend is running and database is reachable.";
    }
    return err.response?.data?.error || err.message || fallbackMessage;
  }

  const signUpWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse?.access_token) {
          setError("Google authentication failed.");
          return;
        }
        const user = await googleLogin(tokenResponse.access_token);
        navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
      } catch (err) {
        const message = err.response?.data?.error || "Google sign-up failed.";
        setError(message);
      }
    },
    onError: () => setError("Google sign-up failed."),
  });

  function handleGoogleSignUp() {
    if (!hasGoogleClientId) {
      setError("Google auth is not configured. Set VITE_GOOGLE_CLIENT_ID (frontend) or GOOGLE_CLIENT_ID (backend) and restart.");
      return;
    }

    setError("");
    signUpWithGoogle();
  }

  function validateForm() {
    const errors = {};
    const fullNameError = validators.fullName(fullName);
    const emailError = validators.email(email);
    const passwordError = validators.password(password);
    const passwordMatchError = validators.passwordMatch(password, confirmPassword);

    if (fullNameError) errors.fullName = fullNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (passwordMatchError) errors.confirmPassword = passwordMatchError;

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
      await register({ fullName, email, password });
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = resolveErrorMessage(err, "Registration failed.");
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
        <h2 className="auth-title">Sign up</h2>
        <p className="auth-sub">Create your account to get started</p>

        <button
          type="button"
          className="social-btn"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          title={
            hasGoogleClientId
              ? "Continue with Google"
              : "Set VITE_GOOGLE_CLIENT_ID (frontend) or GOOGLE_CLIENT_ID (backend)"
          }
        >
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
            alt="googleLogo"
          />
        </button>
        {!hasGoogleClientId && (
          <p className="auth-note">
            Google auth is unavailable until a Google client id is configured.
          </p>
        )}

        <div className="divider-row">
          <div className="divider-line"></div>
          <p className="divider-text">or sign up with email</p>
          <div className="divider-line"></div>
        </div>

        <div className="input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
            className="input-field"
          />
        </div>
        {validationErrors.fullName && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.fullName}</p>
        )}

        <div className="mt-4 input-wrap">
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

        <div className="mt-4 input-wrap">
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
          <button
            type="button"
            className="input-action"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.password}</p>
        )}
        <PasswordSecurityChecks password={password} />

        <div className="mt-4 input-wrap">
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
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm Password"
            className="input-field"
            required
          />
          <button
            type="button"
            className="input-action"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.confirmPassword}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-primary--emerald"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
        <p className="footer-text">
          Already have an account?{" "}
          <Link to="/login" className="footer-link">
            Sign in
          </Link>
        </p>

        {error && (
          <p className="auth-info auth-info--error">{error}</p>
        )}
      </form>
    </AuthPageWrapper>
  );
}
