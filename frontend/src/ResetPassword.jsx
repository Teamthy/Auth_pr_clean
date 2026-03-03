import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";
import PasswordSecurityChecks from "./PasswordSecurityChecks";
import { validators } from "./validators";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors = {};
    const passwordError = validators.password(password);
    const passwordMatchError = validators.passwordMatch(password, confirmPassword);

    if (passwordError) errors.password = passwordError;
    if (passwordMatchError) errors.confirmPassword = passwordMatchError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword({ token, password });
      setMessage(result.message || "Password reset successful.");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageWrapper imageUrl="/leftSideImage.jpg" imageAlt="leftSideImage">
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-sub">Set a new password for your account.</p>

        <div className="mt-8 input-wrap">
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
            placeholder="New password"
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
            placeholder="Confirm password"
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
          className="btn-primary btn-primary--violet"
        >
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>

        {message && (
          <div className="auth-info auth-info--success">
            {message}{" "}
            <Link to="/login" className="footer-link">
              Login
            </Link>
          </div>
        )}
        {error && (
          <p className="auth-info auth-info--error">{error}</p>
        )}
        <p className="footer-text">
          Back to{" "}
          <Link to="/login" className="footer-link">
            Login
          </Link>
        </p>
      </form>
    </AuthPageWrapper>
  );
}
