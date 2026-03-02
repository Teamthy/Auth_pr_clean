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
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
      <p className="mt-2 text-sm text-slate-600">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
      {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    </section>
  );
}
