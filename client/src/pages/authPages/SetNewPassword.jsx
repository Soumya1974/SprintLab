import { useState } from "react";
import { Eye, EyeOff, KeyRound, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/authComponents/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { validatePassword, validateConfirmPassword, getPasswordStrength } from "../../utils/validators";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";

export default function SetNewPassword() {

    const navigate = useNavigate();
    const email = useAuthStore((state) => state.email);
    const clearForgotPasswordProgress = useAuthStore((state) =>
        state.clearForgotPasswordProgress
    )

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [touched, setTouched] = useState({ password: false, confirmPassword: false });

    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);
    const strength = getPasswordStrength(password);
    const isValid = !passwordError && !confirmError;

    function handleBlur(field) {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setTouched({ password: true, confirmPassword: true });
        if (!isValid) return;

        try{
            const response = await api.post("/api/forgot-password/set-password", {
                email,
                newPassword: password
            }, {
                withCredentials: true
            })

            if(response.status === 200){
                toast.success(response.data.message);
                setTimeout(() => {
                    clearForgotPasswordProgress();
                }, 1000);
            }
        }
        catch(err) {
            switch (err.response.status) {
                case 400:
                    toast.error(err.response.data.message);
                    break;
                case 404:
                    toast.error(err.response.data.message);
                    break;
                case 500:
                    toast.error("Internal Server Error");
                    break;
                default:
                    toast.error("Something went wrong");
            }
        }
       
    }

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Choose a new password for your account"
            footer={
                <Link
                    to="/login"
                >
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to log in
                    </button>
                </Link>
            }
        >
            {/* <div className="flex justify-center mb-2 animate-fade-in-up">
                <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <KeyRound className="h-7 w-7 text-blue-600" />
                </div>
            </div> */}

            <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-10 animate-fade-in-up [animation-delay:80ms]"
            >
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-700 mb-1.5 block"
                    >
                        New password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("password")}
                            placeholder="Enter new password"
                            className={`w-full rounded-lg border px-3.5 py-2.5 pr-16 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${touched.password && passwordError
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                    : touched.password && !passwordError
                                        ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                                        : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        />
                        {touched.password && passwordError && (
                            <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
                        )}
                        {touched.password && !passwordError && password && (
                            <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                        )}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {touched.password && passwordError && (
                        <p className="mt-1.5 text-xs text-rose-500 animate-fade-in-down">
                            {passwordError}
                        </p>
                    )}

                    {password && (
                        <div className="mt-2.5">
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
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-slate-700 mb-1.5 block"
                    >
                        Confirm password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur("confirmPassword")}
                            placeholder="Re-enter new password"
                            className={`w-full rounded-lg border px-3.5 py-2.5 pr-16 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${touched.confirmPassword && confirmError
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                    : touched.confirmPassword && !confirmError
                                        ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                                        : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        />
                        {touched.confirmPassword && confirmError && (
                            <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
                        )}
                        {touched.confirmPassword && !confirmError && confirmPassword && (
                            <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                        )}
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                        >
                            {showConfirm ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {touched.confirmPassword && confirmError && (
                        <p className="mt-1.5 text-xs text-rose-500 animate-fade-in-down">
                            {confirmError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium py-2.5 transition-all duration-150"
                >
                    Reset password
                </button>
            </form>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-2px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fadeInDown 0.15s ease-out both; }
            `}</style>
        </AuthLayout>
    );
}