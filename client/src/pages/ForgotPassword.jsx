import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { validateEmail } from "../utils/validators";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

const OTP_LENGTH = 6;

export default function ForgotPassword() {
  const [getEmail, setGetEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [resendIn, setResendIn] = useState(10);
  const inputRefs = useRef([]);

  const error = validateEmail(getEmail);
  const navigate = useNavigate();

  const setEmail = useAuthStore((state) => state.setEmail);
  const email = useAuthStore((state) => state.email);
  const clearEmail = useAuthStore((state) => state.clearEmail);

  useEffect(() => {
    if (!sent || resendIn === 0) return;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [sent, resendIn]);

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (error) return;

    setSubmitting(true);
    // Simulated request — replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    setSent(true);
    setResendIn(30);
  }

  function handleOtpChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      handleVerifySubmit(e);
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^[0-9]+$/.test(pasted)) return;

    const next = pasted.split("");
    while (next.length < OTP_LENGTH) next.push("");
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  const code = otp.join("");
  const isOtpComplete = code.length === OTP_LENGTH;

  async function handleVerifySubmit(e) {
    e.preventDefault();
    if (!isOtpComplete) return;

    try {
      const response = await axios.post('/api/find-account/verify-otp', {
        email,
        otp: code
      }, {
        withCredentials: true
      });

      console.log("email:" ,email);

      if (response.status === 200) {
        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/resetpassword");
        }, 1000);
      }
    }
    catch (err) {
      switch (err.response.status) {

        case 400:
          toast.error(err.response.data.message);
          break;

        case 406:
          toast.error(err.response.data.errors[0].message);
          break;

        case 500:
          toast.error("Internal Server Error");
          break;

        default:
          toast.error("Something went wrong");
      }
    }
  }

  async function handleResend() {
    if (resendIn > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setResendIn(10);
    inputRefs.current[0]?.focus();

  }

  const handleGetOtp = async (e) => {

    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post("/api/find-account", {
        email: getEmail
      }, {
        withCredentials: true
      });

      setEmail(getEmail);

      if (response.status === 200) {
        setTimeout(() => {
          toast.success(response.data.message);
        }, 500);
      }

      setSent(true);
    }
    catch (err) {
      switch (err.response.status) {

        case 400:
          toast.error(err.response.data.message);
          break;

        case 406:
          toast.error(err.response.data.errors[0].message);
          break;

        case 500:
          toast.error("Internal Server Error");
          break;

        default:
          toast.error("Something went wrong");
      }
    }
    finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
    }
  }

  return (
    <AuthLayout
      title={sent ? "Enter verification code" : "Forgot password?"}
      subtitle={
        sent
          ? `Enter the 6-digit code we sent to ${email}`
          : "Enter your email and we'll send you a reset code"
      }
      footer={
        <Link
          to="/login"
        >
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150 hover:cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to log in
          </button>
        </Link>
      }
    >
      {sent ? (
        <div className="animate-fade-in-up">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
            </div>
          </div>

          <form onSubmit={handleVerifySubmit} className="mt-5">
            <div
              className="flex justify-between gap-2 sm:gap-3 mb-6"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`
                    w-full aspect-square max-w-13 text-center text-lg font-semibold
                    rounded-lg border text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                    transition-all duration-150
                    ${digit ? "border-blue-300 bg-blue-50/40" : "border-slate-200"}
                  `}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
            >
              Verify code
            </button>

            <p className="text-center text-sm text-slate-500 mt-5">
              Didn&apos;t get the code?{" "}
              {resendIn > 0 ? (
                <span className="text-slate-400">Resend in {resendIn}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150 hover:cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </form>
        </div>
      ) : (
        <form onSubmit={handleGetOtp} noValidate>
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="you@company.com"
            value={getEmail}
            onChange={(e) => setGetEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150 mt-2 hover:cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Just a sec...
              </>
            ) : (
              "Send reset code"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}