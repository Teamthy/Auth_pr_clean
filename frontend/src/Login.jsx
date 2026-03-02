import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      const fallbackRoute = user.role === "admin" ? "/admin" : "/dashboard";
      const nextRoute = location.state?.from?.pathname || fallbackRoute;
      navigate(nextRoute, { replace: true });
    } catch (err) {
      const message = err.response?.data?.error || "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to your account.</p>
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
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-300 focus:ring"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="font-medium text-cyan-700 hover:underline">
          Forgot password?
        </Link>
        <Link to="/register" className="font-medium text-cyan-700 hover:underline">
          Create account
        </Link>
      </div>
    </section>
  );
}
