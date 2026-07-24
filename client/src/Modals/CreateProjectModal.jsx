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
import api from "../api/axios";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import useWorkspaceStore from "../store/workspaceStore";

const COLORS = [
    { name: "Blue", value: "#2563eb" },
    { name: "Violet", value: "#7c3aed" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Slate", value: "#475569" },
];

const MAX_WORDS = 80;
const MAX_NAME_WORDS = 30;

function countWords(text) {
    if (!text) return 0;
    return text.trim().length;
}

function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

const INITIAL_FORM_DATA = {
    name: "",
    description: "",
    color: COLORS[0].value,
    dueDate: "",
};


export default function CreateProjectModal({ onClose, handleGetData }) {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const refreshWorkspaces = useWorkspaceStore((state) => state.refreshWorkspaces);

    const [touched, setTouched] = useState({ name: false, description: false });

    const [showColor, setShowColor] = useState(false);
    const [showDueDate, setShowDueDate] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const wordCount = countWords(formData.description);
    const nameWordCount = countWords(formData.name);

    const isOverLimit = wordCount > MAX_WORDS;
    const isNameOverLimit = nameWordCount > MAX_NAME_WORDS;

    const nameError = !formData.name.trim()
        ? "Project name is required"
        : isNameOverLimit
            ? `Project name must be ${MAX_NAME_WORDS} charecters or fewer`
            : "";

    const descriptionError = !formData.description.trim()
        ? "Description is required"
        : isOverLimit
            ? `Description must be ${MAX_WORDS} charecters or fewer`
            : "";

    const isValid = !nameError && !descriptionError;


    function updateField(key, value) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function handleBlur(field) {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setTouched({ name: true, description: true });
        if (!isValid) return;

        setSubmitting(true);

        const { name, description, color, dueDate } = formData;

        if (!name || !description) return;

        try {
            const response = await api.post("/api/workspaces", {
                title: name,
                description,
                color,
                dueDate: dueDate || null
            }, {
                withCredentials: true
            });

            if(response.status === 201) {
                toast.success("Project created successfully");
                await handleGetData();
                refreshWorkspaces();
                onClose();
            }
        }
        catch (err) {
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
        finally {
            setSubmitting(false);
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/40 animate-fade-in"
            />

            <div className="relative bg-white border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">

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

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="projectName"
                                className="text-sm font-medium text-slate-700 mb-1.5 block"
                            >
                                Project name <span className="text-rose-500">*</span>
                            </label>
                            <span
                                className={`text-xs font-medium transition-colors duration-150 ${isNameOverLimit ? "text-rose-500" : "text-slate-400"
                                    }`}
                            >
                                {nameWordCount}/{MAX_NAME_WORDS} words
                            </span>
                        </div>
                        <input
                            id="projectName"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            onBlur={() => handleBlur("name")}
                            placeholder="e.g. Mobile App Redesign"
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${touched.name && nameError || isNameOverLimit
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
                            className={`w-full h-15 rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 resize-none ${(touched.description && descriptionError) || isOverLimit
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
                            disabled={submitting}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                            ${submitting
                                    ? "bg-blue-500 cursor-not-allowed opacity-80"
                                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                                } text-white`}
                        >
                            {submitting && (
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}

                            <span>
                                {submitting ? "Creating..." : "Create Project"}
                            </span>
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
        </div>,
        document.body
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