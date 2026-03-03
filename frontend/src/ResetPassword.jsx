import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-800">
        Password Reset
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">Reset Password</h1>
      <p className="mt-2 text-sm text-slate-600">Set a new password for your account.</p>
      <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>
      </form>
      {message && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}{" "}
          <Link to="/login" className="font-medium underline">
            Login
          </Link>
        </div>
      )}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    </section>
  );
}
