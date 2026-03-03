import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";
import { validators } from "./validators";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const canSubmit = email.trim() && code.trim().length === 6;
  const canResend = Boolean(email.trim()) && !validators.email(email);

  function resolveErrorMessage(err, fallbackMessage) {
    const validationMessage = err.response?.data?.errors?.[0]?.msg;
    if (validationMessage) {
      return validationMessage;
    }
    if (err.code === "ERR_NETWORK" || err.code === "CSRF_FETCH_FAILED") {
      return "Cannot reach server. Ensure backend is running and try again.";
    }
    return err.response?.data?.error || err.message || fallbackMessage;
  }

  function validateForm() {
    const errors = {};
    const emailError = validators.email(email);
    const codeError = validators.verificationCode(code);

    if (emailError) errors.email = emailError;
    if (codeError) errors.code = codeError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyEmail({ email, code });
      setMessage(result.message || "Email verified successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setValidationErrors((current) => ({ ...current, email: undefined }));

    const emailError = validators.email(email);
    if (emailError) {
      setValidationErrors((current) => ({ ...current, email: emailError }));
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerification({ email });
      setMessage(result.message || "Verification code sent.");
    } catch (err) {
      setError(resolveErrorMessage(err, "Failed to resend verification code."));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthPageWrapper imageUrl="/leftSideImage.jpg" imageAlt="leftSideImage">
      <form
        onSubmit={handleVerify}
        className="auth-form"
      >
        <h2 className="auth-title">Verify Your Email</h2>
        <p className="auth-sub">
          Enter the 6-digit code sent to your inbox and activate your account.
        </p>

        <div className="mt-8 input-wrap">
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
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="input-field tracking-[0.35em]"
            required
          />
        </div>
        {validationErrors.code && (
          <p className="text-sm text-rose-600 mt-1">{validationErrors.code}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="btn-primary btn-primary--cyan"
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isSubmitting || !canResend}
          className="btn-resend"
        >
          {isResending ? "Sending..." : "Resend code"}
        </button>

        {message && (
          <p className="auth-info auth-info--success">{message}</p>
        )}
        {error && (
          <p className="auth-info auth-info--error">{error}</p>
        )}

        <p className="footer-text">
          Already verified? {" "}
          <Link to="/login" className="footer-link">
            Login
          </Link>
        </p>
      </form>
    </AuthPageWrapper>
  );
}
