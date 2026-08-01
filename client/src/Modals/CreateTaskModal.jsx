import { useState } from "react";
import {
  X,
  ClipboardList,
  Calendar,
  AlertCircle,
  ChevronDown,
  Flag,
  Palette,
  UserRound,
  Check,
} from "lucide-react";
import useWorkspaceStore from "../store/workspaceStore";
import api from "../api/axios";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const COLORS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Slate", value: "#475569" },
];

const PRIORITIES = [
  { label: "Low", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { label: "Medium", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { label: "High", dot: "bg-red-500", text: "text-rose-600", bg: "bg-red-50 border-red-200" },
];

const MAX_DESC_WORDS = 160;
const MAX_TITLE_WORDS = 30;

function countWords(text) {
  if (!text) return 0;
  return text.trim().length;
}

function withAlpha(hex, alpha) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? `${hex}${alpha}` : `#64748b${alpha}`;
}

const INITIAL_FORM = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Low",
  color: COLORS[0].value,
  assignedTo: "",
};

function CollapsibleRow({ icon: Icon, label, open, onToggle, preview, children }) {

  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 group"
      >
        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-xs text-slate-400 font-normal">(optional)</span>
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

export default function CreateTaskModal({ handleGetTaskCards }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({ title: false, description: false });
  const [showDueDate, setShowDueDate] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showAssignTo, setShowAssignTo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const wordCount = countWords(formData.description);
  const isOverLimit = wordCount > MAX_DESC_WORDS;

  const titleWordCount = countWords(formData.title);
  const isTitleOverLimit = titleWordCount > MAX_TITLE_WORDS;

  const clearTaskForm = useWorkspaceStore((state) => state.clearTaskForm);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const workspaceDueDate = useWorkspaceStore((state) => state.workspaceDueDate);
  const projectDetails = useWorkspaceStore((state) => state.projectDetails);

  const rawMembers = projectDetails?.members || [];
  const membersList = [];
  const seenIds = new Set();

  if (projectDetails?.owner && typeof projectDetails.owner === "object" && projectDetails.owner._id) {
    seenIds.add(projectDetails.owner._id.toString());
    membersList.push(projectDetails.owner);
  }

  for (const m of rawMembers) {
    const u = m.user || m;
    if (u && u._id && !seenIds.has(u._id.toString())) {
      seenIds.add(u._id.toString());
      membersList.push(u);
    }
  }

  const selectedMember = membersList.find((m) => m._id === formData.assignedTo);

  const titleError = !formData.title.trim()
    ? "Title is required"
    : isTitleOverLimit
      ? `Title must be ${MAX_TITLE_WORDS} words or fewer`
      : "";

  const descriptionError = !formData.description.trim()
    ? "Description is required"
    : isOverLimit
      ? `Description must be ${MAX_DESC_WORDS} words or fewer`
      : "";

  const isValid = !titleError && !descriptionError;

  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, description: true });
    if (!isValid) return;
    const { title, description, dueDate, priority, color, assignedTo } = formData;
    setSubmitting(true);

    try {
      const response = await api.post(`/api/workspaces/add-task/${workspaceData}`, {
        title,
        description,
        dueDate: dueDate || null,
        priority: priority,
        color,
        assignedTo: assignedTo || null,
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        clearTaskForm();
      }
    }
    catch (err) {
      switch (err.response.status) {
        case 400:
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

  const safeColor = /^#[0-9A-Fa-f]{6}$/.test(formData.color)
    ? formData.color
    : "#64748b";

  const selectedPriority = PRIORITIES.find((p) => p.label === formData.priority);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      <div
        className="absolute inset-0 bg-slate-900/40 animate-fade-in"
      />

      <div className="relative bg-white border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">

        <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Create new task
              </h2>
              <p className="text-xs text-slate-400">
                Add a task to this project
              </p>
            </div>
          </div>
          <button
            onClick={clearTaskForm}
            aria-label="Close"
            className="h-7 w-7 hidden lg:flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 hover:cursor-pointer transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-4">

          {/* title */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="taskTitle"
                className="text-sm font-medium text-slate-700 mb-1.5 block"
              >
                Title <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-xs font-medium transition-colors duration-150 ${isTitleOverLimit ? "text-rose-500" : "text-slate-400"
                  }`}
              >
                {titleWordCount}/{MAX_TITLE_WORDS} words
              </span>
            </div>
            <input
              id="taskTitle"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="e.g. Design the login screen"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 ${touched.title && titleError || isTitleOverLimit
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
            />
            {touched.title && titleError && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {titleError}
              </p>
            )}
          </div>

          {/* description */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="taskDescription"
                className="text-sm font-medium text-slate-700"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-xs font-medium transition-colors duration-150 ${isOverLimit ? "text-rose-500" : "text-slate-400"
                  }`}
              >
                {wordCount}/{MAX_DESC_WORDS} words
              </span>
            </div>
            <textarea
              id="taskDescription"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="What does this task involve?"
              rows={3}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors duration-150 resize-none ${(touched.description && descriptionError) || isOverLimit
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
            />
            {touched.description && descriptionError && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in-down">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {descriptionError}
              </p>
            )}
          </div>

          {/* --- optional collapsible rows --- */}

          {/* due date */}
          <CollapsibleRow
            icon={Calendar}
            label="Due date"
            open={showDueDate}
            onToggle={() => setShowDueDate(!showDueDate)}
            preview={
              !showDueDate && formData.dueDate && (
                <span className="text-xs text-slate-500">{formData.dueDate}</span>
              )
            }
          >
            <div className="pt-1 pb-3">
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  max={workspaceDueDate ? workspaceDueDate.split("T")[0] : undefined}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors duration-150"
                />
              </div>
            </div>
          </CollapsibleRow>

          {/* priority */}
          <CollapsibleRow
            icon={Flag}
            label="Priority"
            open={showPriority}
            onToggle={() => setShowPriority(!showPriority)}
            preview={
              !showPriority && selectedPriority && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${selectedPriority.bg} ${selectedPriority.text}`}
                >
                  {selectedPriority.label}
                </span>
              )
            }
          >
            <div className="flex items-center gap-2.5 pt-1 pb-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => updateField("priority", p.label)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${formData.priority === p.label
                    ? `${p.bg} ${p.text} border-current scale-105`
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </CollapsibleRow>

          {/* color */}
          <CollapsibleRow
            icon={Palette}
            label="Color"
            open={showColor}
            onToggle={() => setShowColor(!showColor)}
            preview={
              !showColor && (
                <span
                  className="h-4 w-4 rounded-full inline-block border border-white shadow-sm"
                  style={{ backgroundColor: safeColor }}
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
                    ? "ring-2 ring-offset-1 ring-slate-400 scale-110"
                    : "hover:scale-110"
                    }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </CollapsibleRow>

          {/* assign to */}
          <CollapsibleRow
            icon={UserRound}
            label="Assign To"
            open={showAssignTo}
            onToggle={() => setShowAssignTo(!showAssignTo)}
            preview={
              !showAssignTo && selectedMember && (
                <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]">
                  {selectedMember.name}
                </span>
              )
            }
          >
            <div className="pt-1 pb-3 max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {membersList.length === 0 ? (
                <p className="text-xs text-slate-400 italic px-2 py-1">No workspace members found</p>
              ) : (
                membersList.map((member) => {
                  const isSelected = formData.assignedTo === member._id;
                  return (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => updateField("assignedTo", isSelected ? "" : member._id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left text-xs transition-all duration-150 ${isSelected
                        ? "border-blue-500 bg-blue-50/80 text-blue-900 font-medium"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-6 w-6 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 font-semibold flex items-center justify-center text-[10px] shrink-0">
                            {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <div className="truncate">
                          <p className="truncate font-medium leading-tight">{member.name}</p>
                          {member.email && (
                            <p className="truncate text-[10px] text-slate-400 font-normal">{member.email}</p>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </CollapsibleRow>

          {/* actions */}
          <div className="flex items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={clearTaskForm}
              className="flex-1 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg hover:cursor-pointer transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-150 ${isValid
                ? "text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                : "text-white bg-blue-300 cursor-not-allowed"
                }`}
            >
              {submitting && (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}

              <span>{submitting ? "Just a sec" : "Create Task"}</span>
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
        .animate-fade-in { animation: fadeIn 0.2s ease-out both; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out both; }
        .animate-fade-in-down { animation: fadeInDown 0.15s ease-out both; }
      `}</style>
    </div>,
    document.body
  );
}