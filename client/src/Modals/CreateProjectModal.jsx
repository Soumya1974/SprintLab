import { useState } from "react";
import {
    X,
    FolderPlus,
    Calendar,
    Mail,
    Plus,
    AlertCircle,
    ChevronDown,
    Palette,
    Users,
} from "lucide-react";

const COLORS = [
    { name: "Blue", value: "#2563eb" },
    { name: "Violet", value: "#7c3aed" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Slate", value: "#475569" },
];

const MAX_WORDS = 50;

function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Single object holding every field — mirrors what you'd POST to the backend.
const INITIAL_FORM_DATA = {
    name: "",
    description: "",
    color: COLORS[0].value,
    dueDate: "",
    invitedEmails: [],
};

export default function CreateProjectModal({ open, onClose, onCreate }) {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [touched, setTouched] = useState({ name: false, description: false });

    // collapsible sections — closed by default, open on tap
    const [showColor, setShowColor] = useState(false);
    const [showDueDate, setShowDueDate] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    const wordCount = countWords(formData.description);
    const isOverLimit = wordCount > MAX_WORDS;

    const nameError = !formData.name.trim() ? "Project name is required" : "";
    const descriptionError = !formData.description.trim()
        ? "Description is required"
        : isOverLimit
            ? `Description must be ${MAX_WORDS} words or fewer`
            : "";

    const isValid = !nameError && !descriptionError;


    // generic helper — updates one key inside the single formData object
    function updateField(key, value) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function handleBlur(field) {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    function handleAddEmail() {
        const value = emailInput.trim();
        if (!value) return;

        if (!validateEmail(value)) {
            setEmailError("Enter a valid email address");
            return;
        }
        if (formData.invitedEmails.includes(value)) {
            setEmailError("This email is already added");
            return;
        }

        updateField("invitedEmails", [...formData.invitedEmails, value]);
        setEmailInput("");
        setEmailError("");
    }

    function handleEmailKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
        }
    }

    function handleRemoveEmail(email) {
        updateField(
            "invitedEmails",
            formData.invitedEmails.filter((e) => e !== email)
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        setTouched({ name: true, description: true });
        if (!isValid) return;

        // formData is already shaped exactly as you'd send it to the backend:
        // { name, description, color, dueDate, invitedEmails }
        onCreate?.(formData);
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 animate-fade-in"
            />

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white z-10">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FolderPlus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">
                                Create new project
                            </h2>
                            <p className="text-xs text-slate-400">
                                Set up a project for your team to start working in
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="h-7 w-7 hidden md:flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 hover:cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="px-6 pb-6">
                    {/* project name */}
                    <div className="mb-4">
                        <label
                            htmlFor="projectName"
                            className="text-sm font-medium text-slate-700 mb-1.5 block"
                        >
                            Project name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="projectName"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            onBlur={() => handleBlur("name")}
                            placeholder="e.g. Mobile App Redesign"
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${touched.name && nameError
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        />
                        {touched.name && nameError && (
                            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {nameError}
                            </p>
                        )}
                    </div>

                    {/* description */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="projectDescription"
                                className="text-sm font-medium text-slate-700"
                            >
                                Description <span className="text-rose-500">*</span>
                            </label>
                            <span
                                className={`text-xs font-medium transition-colors duration-150 ${isOverLimit ? "text-rose-500" : "text-slate-400"
                                    }`}
                            >
                                {wordCount}/{MAX_WORDS} words
                            </span>
                        </div>
                        <textarea
                            id="projectDescription"
                            value={formData.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            onBlur={() => handleBlur("description")}
                            placeholder="What's this project about?"
                            rows={3}
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 resize-none ${(touched.description && descriptionError) || isOverLimit
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                }`}
                        />
                        {touched.description && descriptionError && (
                            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {descriptionError}
                            </p>
                        )}
                    </div>

                    {/* divider for optional sections */}
                    <div className="border-t border-slate-100 -mx-6 mb-1" />

                    {/* color - collapsible */}
                    <CollapsibleRow
                        icon={Palette}
                        label="Color"
                        open={showColor}
                        onToggle={() => setShowColor(!showColor)}
                        preview={
                            !showColor && (
                                <span
                                    className="h-4 w-4 rounded-full inline-block"
                                    style={{ backgroundColor: formData.color }}
                                />
                            )
                        }
                    >
                        <div className="flex items-center gap-2.5 px-2 py-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => updateField("color", c.value)}
                                    aria-label={c.name}
                                    className={`h-6 w-6 rounded-full transition-transform duration-150 hover:cursor-pointer ${formData.color === c.value
                                            ? "ring-2 ring-offset-1 ring-slate-400 scale-105"
                                            : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: c.value }}
                                />
                            ))}
                        </div>
                    </CollapsibleRow>

                    {/* due date - collapsible */}
                    <CollapsibleRow
                        icon={Calendar}
                        label="Due date"
                        open={showDueDate}
                        onToggle={() => setShowDueDate(!showDueDate)}
                        preview={
                            !showDueDate &&
                            formData.dueDate && (
                                <span className="text-xs text-slate-500">
                                    {formData.dueDate}
                                </span>
                            )
                        }
                    >
                        <div className="pt-1 pb-3">
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => updateField("dueDate", e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors duration-150"
                                />
                            </div>
                        </div>
                    </CollapsibleRow>

                    {/* invite members - collapsible */}
                    <CollapsibleRow
                        icon={Users}
                        label="Invite members"
                        open={showInvite}
                        onToggle={() => setShowInvite(!showInvite)}
                        preview={
                            !showInvite &&
                            formData.invitedEmails.length > 0 && (
                                <span className="text-xs text-slate-500">
                                    {formData.invitedEmails.length} added
                                </span>
                            )
                        }
                    >
                        <div className="pt-1 pb-3">
                            <div className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => {
                                            setEmailInput(e.target.value);
                                            if (emailError) setEmailError("");
                                        }}
                                        onKeyDown={handleEmailKeyDown}
                                        placeholder="teammate@company.com"
                                        className={`w-full rounded-lg border pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${emailError
                                                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                                            }`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddEmail}
                                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-slate-200 hover:cursor-pointer px-3.5 py-2.5 rounded-lg transition-colors duration-150 shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </button>
                            </div>

                            {emailError && (
                                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {emailError}
                                </p>
                            )}

                            {formData.invitedEmails.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.invitedEmails.map((email) => (
                                        <span
                                            key={email}
                                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium pl-2.5 pr-1.5 py-1.5 rounded-full animate-fade-in-up"
                                        >
                                            {email}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEmail(email)}
                                                aria-label={`Remove ${email}`}
                                                className="h-4 w-4 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors duration-150"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CollapsibleRow>

                    {/* actions */}
                    <div className="flex items-center gap-2.5 mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg transition-colors duration-150 hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-4 py-2.5 rounded-lg transition-all duration-150 hover:cursor-pointer"
                        >
                            Create project
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out both; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out both; }
        .animate-fade-in-down { animation: fadeInDown 0.15s ease-out both; }
        .animate-fade-in-up { animation: fadeInUp 0.15s ease-out both; }
      `}</style>
        </div>
    );
}

// Collapsible row used for Color / Due date / Invite members.
// Closed by default — header is always visible, tapping it expands the content below.
function CollapsibleRow({ icon: Icon, label, open, onToggle, preview, children }) {
    return (
        <div className="border-b border-slate-100 last:border-b-0">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between py-3 group"
            >
                <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="text-xs text-slate-400 font-normal">
                        (optional)
                    </span>
                </span>
                <span className="flex items-center gap-2">
                    {preview}
                    <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""
                            }`}
                    />
                </span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}