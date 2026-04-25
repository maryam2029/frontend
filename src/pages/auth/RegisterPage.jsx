/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Send, ShieldCheck } from "lucide-react";
import { registerUser, resendOtp, verifyOtp } from "@/services/auth.service";
import { setStoredToken } from "@/lib/auth";

const initialFormState = {
  fName: "",
  phoneNumber: "",
  email: "",
  password: "",
  address: "",
  role: "Seller",
};

export default function RegisterPage({ onAuthSuccess }) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialFormState);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailToVerify = useMemo(() => pendingEmail || form.email.trim(), [pendingEmail, form.email]);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email")?.trim();
    if (!emailFromQuery) return;

    setForm((current) => ({ ...current, email: emailFromQuery }));
    setPendingEmail(emailFromQuery);
    setIsOtpStep(true);
    setMessage("Complete OTP verification for your existing account.");
    setError("");
  }, [searchParams]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const payload = {
      fName: form.fName.trim(),
      email: form.email.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim() || undefined,
      address: form.address.trim() || undefined,
      role: form.role || undefined,
    };

    try {
      const response = await registerUser(payload);
      setPendingEmail(payload.email);
      setIsOtpStep(true);
      setMessage(response?.message || "Account created. Check your email for the OTP code.");
    } catch (err) {
      const backendMessage = err.message || "Unable to register.";
      const normalizedMessage = backendMessage.toLowerCase();

      if (normalizedMessage.includes("email already exists")) {
        setError("This email is already verified. Please sign in.");
        setMessage("");
        return;
      }

      if (normalizedMessage.includes("failed to send otp email")) {
        setError("Unable to send OTP email. Check backend email configuration then try again.");
        setMessage("");
        return;
      }

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await verifyOtp({
        email: emailToVerify,
        otp: otp.trim(),
      });

      if (!response?.token) {
        throw new Error("OTP verified but no token was returned.");
      }

      setStoredToken(response.token);
      onAuthSuccess?.();
    } catch (err) {
      setError(err.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailToVerify) {
      setError("Email is required to resend OTP.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resendOtp(emailToVerify);
      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid min-h-[560px] w-full max-w-[860px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.16)] md:grid-cols-2">
        <aside className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-700 to-blue-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(167,243,208,0.35),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.40),transparent_45%)]" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
              RxLink
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Build your account and get started fast.
            </h2>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
          {!isOtpStep ? (
            <form onSubmit={handleRegister} noValidate>
              <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
              <p className="mt-1 text-sm text-slate-500">Join the next generation</p>

              <Field
                label="Full Name"
                name="fName"
                value={form.fName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <Field
                label="Your Number"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="01012345678"
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />

              <Field
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
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

              {message ? <MessageBox type="success">{message}</MessageBox> : null}
              {error ? <MessageBox type="error">{error}</MessageBox> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="mt-4 text-center text-sm text-slate-600">
                Already have an account?
                <Link to="/login" className="ml-1 font-bold text-slate-900 hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} noValidate>
              <h1 className="text-3xl font-black text-slate-900">Verify OTP</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the code sent to <span className="font-semibold text-slate-700">{emailToVerify}</span>
              </p>

              <Field
                label="Email"
                name="email"
                type="email"
                value={emailToVerify}
                onChange={(event) => {
                  const value = event.target.value;
                  setPendingEmail(value);
                  setForm((current) => ({ ...current, email: value }));
                }}
                placeholder="name@example.com"
                required
              />

              <div className="mt-4">
                <label className="text-sm font-semibold text-slate-700">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              {message ? <MessageBox type="success">{message}</MessageBox> : null}
              {error ? <MessageBox type="error">{error}</MessageBox> : null}

              <button
                type="submit"
                disabled={loading || otp.trim().length !== 6}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={14} />
                Resend OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setMessage("");
                  setError("");
                }}
                className="mt-2 w-full text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Edit registration details
              </button>
            </form>
          )}
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
