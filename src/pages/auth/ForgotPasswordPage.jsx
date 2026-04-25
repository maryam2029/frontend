import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isResetStep, setIsResetStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email")?.trim();
    if (!emailFromQuery) return;
    setEmail(emailFromQuery);
  }, [searchParams]);

  const handleRequestReset = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await requestPasswordReset(normalizedEmail);
      setIsResetStep(true);
      setMessage(
        response?.message ||
          "If this email exists, a password reset code has been sent.",
      );
    } catch (err) {
      setError(err.message || "Unable to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !resetCode.trim() || !newPassword) {
      setError("Please complete all fields.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await resetPassword({
        email: normalizedEmail,
        resetCode: resetCode.trim(),
        newPassword,
      });

      setMessage(response?.message || "Password has been reset successfully.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid min-h-[560px] w-full max-w-[860px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.16)] md:grid-cols-2">
        <aside className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-700 to-indigo-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.3),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(129,140,248,0.35),transparent_45%)]" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100/80">
              RxLink
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Recover your access securely.
            </h2>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
          {!isResetStep ? (
            <form onSubmit={handleRequestReset} noValidate>
              <h1 className="text-3xl font-black text-slate-900">Forgot Password</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter your email and we will send a reset code.
              </p>

              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />

              <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Agree to terms
              </label>

              {error ? <MessageBox type="error">{error}</MessageBox> : null}
              {message ? <MessageBox type="success">{message}</MessageBox> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} noValidate>
              <h1 className="text-3xl font-black text-slate-900">Reset Password</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the code we sent to your email and choose a new password.
              </p>

              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />

              <Field
                label="Reset Code"
                value={resetCode}
                onChange={(event) =>
                  setResetCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />

              <Field
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
              />

              {error ? <MessageBox type="error">{error}</MessageBox> : null}
              {message ? <MessageBox type="success">{message}</MessageBox> : null}

              <button
                type="submit"
                disabled={loading || resetCode.trim().length !== 6}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetStep(false);
                  setResetCode("");
                  setNewPassword("");
                  setError("");
                  setMessage("");
                }}
                className="mt-2 w-full text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Back to email step
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", ...props }) {
  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500"
        {...props}
      />
    </div>
  );
}

function MessageBox({ type, children }) {
  const classes =
    type === "error"
      ? "mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
      : "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700";

  return <div className={classes}>{children}</div>;
}
