import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  rightSlot,
  showValid = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const hasError = touched && error;
  const isValid = touched && !error && value && showValid;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        {rightSlot}
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-150
            ${
              hasError
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : isValid
                ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
            }
            ${isPassword || isValid || hasError ? "pr-10" : ""}
          `}
        />

        {isPassword && (
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
        )}

        {!isPassword && hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
        )}

        {!isPassword && isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
          {error}
        </p>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.15s ease-out both; }
      `}</style>
    </div>
  );
}