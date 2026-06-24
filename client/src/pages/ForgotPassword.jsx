import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { validateEmail } from "../utils/validators";

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const error = validateEmail(email);

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (error) return;

    setSubmitting(true);
    // Simulated request — replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    setSent(true);
  }

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Forgot password?"}
      subtitle={
        sent
          ? `We've sent a reset link to ${email}`
          : "Enter your email and we'll send you a reset link"
      }
      footer={
        <button
          type="button"
          onClick={() => onNavigate?.("login")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to log in
        </button>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center py-4 animate-fade-in-up">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <MailCheck className="h-7 w-7 text-emerald-500" />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Didn&apos;t get the email? Check your spam folder, or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
            >
              try another address
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150 mt-2"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}