import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

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
    <div className="flex w-full min-h-[700px]">
      <div className="hidden w-full md:inline-block">
        <img
          className="h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/register/leftSideImage.png"
          alt="registerCover"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex w-80 flex-col items-center justify-center md:w-96"
        >
          <h2 className="text-4xl font-medium text-gray-900">Sign up</h2>
          <p className="mt-3 text-sm text-gray-500/90">Create your account to get started</p>

          <button
            type="button"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-gray-500/10"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="my-5 flex w-full items-center gap-4">
            <div className="h-px w-full bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">or sign up with email</p>
            <div className="h-px w-full bg-gray-300/90"></div>
          </div>

          <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
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
              className="h-full w-full bg-transparent text-sm text-gray-500/80 placeholder-gray-500/80 outline-none"
            />
          </div>

          <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
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
              className="h-full w-full bg-transparent text-sm text-gray-500/80 placeholder-gray-500/80 outline-none"
              required
            />
          </div>

          <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
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
              className="h-full w-full bg-transparent text-sm text-gray-500/80 placeholder-gray-500/80 outline-none"
              required
            />
          </div>

          <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
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
              className="h-full w-full bg-transparent text-sm text-gray-500/80 placeholder-gray-500/80 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 h-11 w-full rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
          <p className="mt-4 text-sm text-gray-500/90">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <p className="mt-4 w-full rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
