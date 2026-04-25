import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogIn, RefreshCcw } from "lucide-react";
import { loginUser, resendOtp } from "@/services/auth.service";
import { setStoredToken } from "@/lib/auth";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const verifyOtpLink = useMemo(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "/register";
    return `/register?email=${encodeURIComponent(trimmedEmail)}`;
  }, [email]);

  const forgotPasswordLink = useMemo(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "/forgot-password";
    return `/forgot-password?email=${encodeURIComponent(trimmedEmail)}`;
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const token = response?.token;

      if (!token) {
        throw new Error("Login succeeded but token is missing in response.");
      }

      setStoredToken(token);
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Unable to login right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Type your email first to resend OTP.");
      return;
    }

    setError("");
    setInfo("");
    setResendingOtp(true);

    try {
      const response = await resendOtp(normalizedEmail);
      setInfo(response?.message || "A new OTP has been sent.");
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid min-h-[560px] w-full max-w-[860px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.16)] md:grid-cols-2">
        <aside className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-800 to-cyan-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.45),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,116,144,0.55),transparent_42%)]" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
              RxLink
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Welcome back to your control panel.
            </h2>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col justify-center p-6 sm:p-8 md:p-10"
        >
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email and password to login
          </p>

          <label className="mt-6 text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500"
            required
          />

          <label className="mt-4 text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            autoComplete="current-password"
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500"
            required
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) => setAgreeTerms(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Agree to terms
            </label>

            <Link
              to={forgotPasswordLink}
              className="text-xs font-semibold text-slate-700 transition hover:text-slate-950"
            >
              Forgot Password?
            </Link>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              <p>{error}</p>

              {error.toLowerCase().includes("verify otp") ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    to={verifyOtpLink}
                    className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white"
                  >
                    Open OTP verification
                  </Link>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendingOtp}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendingOtp ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
                    {resendingOtp ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {info ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {info}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don&apos;t have an account?
            <Link to="/register" className="ml-1 font-bold text-slate-900 hover:underline">
              Create An Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
