import { useState } from "react";
import AuthLayout from "../../components/authComponents/AuthLayout";
import FormField from "../../components/authComponents/FormField";
import { validateEmail, validateLoginPassword } from "../../utils/validators";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onNavigate }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({});
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const setUser = useWorkspaceStore((state) => state.setUser);
    const setAccessToken = useAuthStore((state) =>
        state.setAccessToken
    );
    const clearEmail = useAuthStore((state) =>
        state.clearEmail
    );
    const inviteToken = useAuthStore((state) =>
        state.inviteToken
    );
    const clearInviteToken = useAuthStore((state) =>
        state.clearInviteToken
    );

    const navigate = useNavigate();

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

        setSubmitError("");

        const { email, password } = form;

        if (!email || !password) {
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post('/api/login', {
                email,
                password
            },
                {
                    withCredentials: true
                }
            );


            if (response.status === 200) {
                setAccessToken(response.data.accessToken);

                const userResponse = await api.get(
                    "/api/users/profile/get-userdata",
                    {
                        withCredentials: true,
                    }
                );

                if (userResponse.status === 200) {
                    setUser(userResponse.data.user);
                }

                if (inviteToken) {
                    const inviteResponse = await api.post(
                        `/api/accept-invitations/${inviteToken}`,
                        {},
                        { withCredentials: true }
                    );

                    if (inviteResponse.status === 200) {
                        toast.success(inviteResponse.data.message);
                    }

                    clearInviteToken();
                    navigate("/dashboard");
                }
            }
        }
        catch (err) {

            if (!err.response) {
                toast.error("Network error");
                return;
            }

            switch (err.response.status) {
                case 400:
                case 401:
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
            setSubmitting(false);
        }
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
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:cursor-pointer duration-150"
                    >
                        <Link
                            to="/signup"
                        >
                            Sign up
                        </Link>
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
                        <Link
                            to="/forgotpassword"
                        >
                            <button
                                type="button"

                                className="text-xs font-medium hover:cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-150"
                            >
                                Forgot password?
                            </button>
                        </Link>
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
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed hover:cursor-pointer active:scale-[0.98] text-white text-sm font-medium py-2.5 transition-all duration-150"
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