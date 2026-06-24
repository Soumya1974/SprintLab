import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { validateEmail, validateLoginPassword } from "../utils/validators";

export default function Login({ onNavigate }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({});
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const errors = {
        email: validateEmail(form.email),
        password: validateLoginPassword(form.password),
    };

    const isValid = !errors.email && !errors.password;

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
        setTouched({ email: true, password: true });
        if (!isValid) return;

        setSubmitting(true);
        setSubmitError("");

        // Simulated request — replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 900));
        setSubmitting(false);

        // Example failure path:
        // setSubmitError("Invalid email or password");
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to continue to your workspace"
            footer={
                <p className="text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => onNavigate?.("signup")}
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
                    >
                        Sign up
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
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                />

                <FormField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    rightSlot={
                        <button
                            type="button"
                            onClick={() => onNavigate?.("forgot")}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
                        >
                            Forgot password?
                        </button>
                    }
                />

                <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600">Remember me</span>
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
                >
                    {submitting ? (
                        <>
                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        "Log in"
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}