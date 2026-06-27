import { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

const OTP_LENGTH = 6;

export default function VerifyOtp({ email = "you@company.com", onNavigate }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [resendIn, setResendIn] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendIn === 0) return;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  function handleChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^[0-9]+$/.test(pasted)) return;

    const next = pasted.split("");
    while (next.length < OTP_LENGTH) next.push("");
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  const code = otp.join("");
  const isComplete = code.length === OTP_LENGTH;

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the 6-digit code we sent to ${email}`}
      footer={
        <button
          type="button"
          onClick={() => onNavigate?.("signup")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up
        </button>
      }
    >
      <div className="flex justify-center mb-2 animate-fade-in-up">
        <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
          <ShieldCheck className="h-7 w-7 text-blue-600" />
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5 animate-fade-in-up [animation-delay:80ms]"
      >
        <div className="flex justify-between gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
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
          disabled={!isComplete}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
        >
          Verify and continue
        </button>

        <p className="text-center text-sm text-slate-500 mt-5">
          Didn&apos;t get the code?{" "}
          {resendIn > 0 ? (
            <span className="text-slate-400">Resend in {resendIn}s</span>
          ) : (
            <button
              type="button"
              onClick={() => setResendIn(30)}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
            >
              Resend code
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}