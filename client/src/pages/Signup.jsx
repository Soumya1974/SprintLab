import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from "../utils/validators";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [agreedTouched, setAgreedTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(
      form.password,
      form.confirmPassword
    ),
  };

  // console.log(form);

  const isValid = !Object.values(errors).some(Boolean) && agreed;
  const strength = getPasswordStrength(form.password);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError("");
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setAgreedTouched(true);
    if (!isValid) return;

    setSubmitting(true);
    setSubmitError("");

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    try {
      const response = await axios.post('/api/signup', {
        form
      },
        {
          withCredentials: true
        }
      )
    }
    catch (err) {

    }

  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your sprints in minutes"
      footer={
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate?.("login")}
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            Log in
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-sm text-rose-600 animate-fade-in-down">
            {submitError}
          </div>
        )}

        <FormField
          label="Full name"
          name="name"
          placeholder="Jordan Lee"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          showValid
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          showValid
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
        />

        {form.password && (
          <div className="-mt-3 mb-4 animate-fade-in-down">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300 ease-out rounded-full`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Password strength:{" "}
              <span className="font-medium text-slate-500">
                {strength.label}
              </span>
            </p>
          </div>
        )}

        <FormField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          showValid
        />

        <label className="flex items-start gap-2 mb-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setAgreedTouched(true);
            }}
            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-200 cursor-pointer shrink-0"
          />
          <span className="text-sm text-slate-600 leading-snug">
            I agree to the{" "}
            <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </label>
        {agreedTouched && !agreed && (
          <p className="mb-4 text-xs text-rose-500 animate-fade-in-down">
            You must agree to the terms to continue
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150 ${agreedTouched && !agreed ? "mt-0" : "mt-5"
            }`}
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}