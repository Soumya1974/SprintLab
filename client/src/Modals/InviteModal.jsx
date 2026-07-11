import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Mail, UserPlus, Eye, Users } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [roleOpen, setRoleOpen] = useState(false);
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value) => {
        if (!value) {
            setEmailError("Email is required");
            return false;
        }
        if (!EMAIL_REGEX.test(value)) {
            setEmailError("Enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (emailError) validateEmail(value);
    };

    const handleInvite = () => {
        if (!validateEmail(email)) return;
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40"
            />

            <div className="relative w-full max-w-md bg-white shadow-xl border border-slate-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Invite to workspace</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={(e) => validateEmail(e.target.value)}
                                placeholder="name@company.com"
                                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${emailError
                                    ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                                    : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                            />
                        </div>
                        {emailError && (
                            <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
                        )}
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setRoleOpen(!roleOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <span className="text-sm font-medium text-slate-700">
                                Role: <span className="capitalize text-indigo-600">{role}</span>
                            </span>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform ${roleOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {roleOpen && (
                            <div className="p-3 space-y-2 bg-white">
                                <label
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${role === "viewer"
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="viewer"
                                        checked={role === "viewer"}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="accent-indigo-600"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-slate-700" />
                                        <span className="text-sm text-slate-700">Viewer</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${role === "team"
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="team"
                                        checked={role === "team"}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="accent-indigo-600"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-slate-700" />
                                        <span className="text-sm text-slate-700">Team member</span>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                        Viewer can only view tasks and notes | Team members can create and edit tasks and collaborate.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInvite}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        <UserPlus size={16} className="inline-block mr-2" />
                        Invite
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}