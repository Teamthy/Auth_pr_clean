import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthPageWrapper from "./AuthPageWrapper";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed.";
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
        >
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
            alt="googleLogo"
          />
        </button>

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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
        </div>

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
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm Password"
            className="input-field"
            required
          />
        </div>

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
