import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";
import { validators } from "./validators";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors = {};
    const emailError = validators.email(email);
    if (emailError) errors.email = emailError;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await forgotPassword({ email });
      setMessage(result.message || "If the account exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process request.");
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
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-sub">Enter your email to receive a reset link</p>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-primary--amber"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p className="auth-info auth-info--success">{message}</p>
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
