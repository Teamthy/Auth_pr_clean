import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim() && code.trim().length === 6, [email, code]);

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setMessage("");
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

    try {
      const result = await resendVerification({ email });
      setMessage(result.message || "Verification code sent.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend verification code.");
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
        Email Verification
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">Verify Your Email</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the 6-digit code sent to your inbox and activate your account.
      </p>

      <form onSubmit={handleVerify} className="mt-7 grid gap-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Verification code
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="rounded-xl border border-slate-300 px-3 py-2.5 tracking-[0.35em] outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="rounded-full bg-slate-900 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Resend code
      </button>

      {message && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <p className="mt-4 text-sm text-slate-600">
        Already verified?{" "}
        <Link to="/login" className="font-medium text-cyan-700 hover:underline">
          Login
        </Link>
      </p>
    </section>
  );
}
