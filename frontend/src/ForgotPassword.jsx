import { useState } from "react";
import { useAuth } from "./context/useAuth";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
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
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Account Recovery
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">Forgot Password</h1>
      <p className="mt-2 text-sm text-slate-600">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
      {message && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    </section>
  );
}
