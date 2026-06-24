export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Enter a valid email address";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter";
  if (!/[0-9]/.test(value)) return "Add at least one number";
  return "";
}

export function validateLoginPassword(value) {
  if (!value) return "Password is required";
  return "";
}

export function validateName(value) {
  if (!value.trim()) return "Full name is required";
  if (value.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}

export function validateConfirmPassword(password, confirmValue) {
  if (!confirmValue) return "Please confirm your password";
  if (password !== confirmValue) return "Passwords do not match";
  return "";
}

export function getPasswordStrength(value) {
  if (!value) return { label: "", percent: 0, color: "" };
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = [
    { label: "Weak", percent: 25, color: "bg-rose-400" },
    { label: "Fair", percent: 50, color: "bg-amber-400" },
    { label: "Good", percent: 75, color: "bg-blue-400" },
    { label: "Strong", percent: 100, color: "bg-emerald-400" },
  ];

  return levels[Math.max(score - 1, 0)];
}