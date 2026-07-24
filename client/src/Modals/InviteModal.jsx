import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { X, ChevronDown, Mail, UserPlus, Eye, Users } from "lucide-react";
import useWorkspaceStore from "../store/workspaceStore";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteModal({ onClose, anchorRef }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [roleOpen, setRoleOpen] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const workspaceData = useWorkspaceStore((state) => state.workspaceData);

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

    const handleInvite = async () => {
        if (!validateEmail(email)) return;
        setSubmitting(true);

        try {
            const response = await api.post(`/api/workspaces/${workspaceData}/invite`, {
                email,
                role,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                onClose();
            }
        }
        catch (err) {
            switch (err.response.status) {
                case 400:
                    toast.error(err.response.data.message);
                    break;
                case 403:
                    toast.error(err.response.data.message);
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
    };

    const rect = anchorRef?.current?.getBoundingClientRect();

    const desktopStyle = rect
        ? {
            top: rect.bottom + window.scrollY + 10,
            left: rect.left + window.scrollX - 420, // modal width + gap
        }
        : {};

    return createPortal(
        <>
            {/* Mobile */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
                <div
                    className="absolute inset-0 bg-slate-900/40"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-md bg-white shadow-xl border border-slate-200 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">
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
                                type="button"
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
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Just a sec...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Invite
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block fixed inset-0 z-50">
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                />

                <div
                    style={desktopStyle}
                    className="absolute w-100 bg-white shadow-xl border border-slate-300 rounded-lg bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]"
                >
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
                                type="button"
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
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Just a sec...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Invite
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
