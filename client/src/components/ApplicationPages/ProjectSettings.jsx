import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Check,
    AlertCircle,
    Loader2,
    FileText,
    CalendarClock,
    Users,
    ArrowRightLeft,
    Search,
    X,
} from "lucide-react";

const CARD = "border border-[#E5E7EB] bg-white";

// ---- Mock data shape — swap for real API calls ----------------------------
// GET /api/workspaces               -> [{ _id, title }]
// GET /api/workspaces/:id           -> { _id, title, description, dueDate, owner, members: [{ _id, name, email, role, avatar }] }
// PATCH /api/workspaces/:id         -> { title, description, dueDate }
// PATCH /api/workspaces/:id/owner   -> { newOwnerId }
// DELETE /api/workspaces/:id
const MOCK_WORKSPACES = [
    { _id: "ws_1", title: "SprintLab Core" },
    { _id: "ws_2", title: "Veda AI" },
    { _id: "ws_3", title: "CashFlow" },
];

const MOCK_WORKSPACE_DETAILS = {
    ws_1: {
        _id: "ws_1",
        title: "SprintLab Core",
        description: "Main product workspace for the SprintLab project management platform.",
        dueDate: "2026-12-31",
        owner: "u_1",
        members: [
            { _id: "u_1", name: "Soumya Ranjan Sahoo", email: "soumya.sahoo@example.com", role: "Owner" },
            { _id: "u_2", name: "Ankita Das", email: "ankita.das@example.com", role: "Admin" },
            { _id: "u_3", name: "Rahul Nayak", email: "rahul.nayak@example.com", role: "Member" },
            { _id: "u_4", name: "Priya Mishra", email: "priya.mishra@example.com", role: "Viewer" },
        ],
    },
    ws_2: {
        _id: "ws_2",
        title: "Veda AI",
        description: "AI research and prototyping workspace.",
        dueDate: "2026-06-30",
        owner: "u_1",
        members: [
            { _id: "u_1", name: "Soumya Ranjan Sahoo", email: "soumya.sahoo@example.com", role: "Owner" },
            { _id: "u_5", name: "Kabir Sethi", email: "kabir.sethi@example.com", role: "Member" },
        ],
    },
    ws_3: {
        _id: "ws_3",
        title: "CashFlow",
        description: "",
        dueDate: "",
        owner: "u_1",
        members: [
            { _id: "u_1", name: "Soumya Ranjan Sahoo", email: "soumya.sahoo@example.com", role: "Owner" },
        ],
    },
};
// -----------------------------------------------------------------------------

function initialOf(name) {
    return name?.charAt(0)?.toUpperCase() || "U";
}

function FieldLabel({ children, hint }) {
    return (
        <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">{children}</label>
            {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
        </div>
    );
}

function TextInput({ error, className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-600 ${error ? "border-red-400 focus:border-red-500" : "border-[#E5E7EB]"
                } ${className}`}
        />
    );
}

function TextArea({ error, className = "", ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full resize-none border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-600 ${error ? "border-red-400 focus:border-red-500" : "border-[#E5E7EB]"
                } ${className}`}
        />
    );
}

function ErrorText({ children }) {
    if (!children) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {children}
        </p>
    );
}

function PrimaryButton({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-1.5 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}

function GhostButton({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-1.5 border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}

function SectionHeader({ eyebrow, title, description }) {
    return (
        <div className="mb-6">
            {eyebrow && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
            )}
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
    );
}

// Workspace selector dropdown
function WorkspaceSelector({ workspaces, selectedId, onSelect, loading }) {
    const [open, setOpen] = useState(false);
    const selected = workspaces.find((w) => w._id === selectedId);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between border border-[#E5E7EB] bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 sm:w-72"
            >
                <span className="truncate">
                    {loading ? "Loading workspaces…" : selected?.title || "Select a workspace"}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className={`${CARD} absolute z-20 mt-1 w-full sm:w-72`}>
                        {workspaces.map((w) => (
                            <button
                                key={w._id}
                                onClick={() => {
                                    onSelect(w._id);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${w._id === selectedId
                                    ? "bg-blue-50 font-medium text-blue-600"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                {w.title}
                                {w._id === selectedId && <Check className="h-3.5 w-3.5" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Transfer ownership modal
function TransferOwnershipModal({ members, currentOwnerId, workspaceTitle, onClose, onConfirm, submitting }) {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [search, setSearch] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const eligibleMembers = members.filter((m) => m._id !== currentOwnerId);
    const filteredMembers = eligibleMembers.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
    );

    const selectedMember = members.find((m) => m._id === selectedMemberId);
    const canConfirm = selectedMemberId && confirmText === "TRANSFER";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className={`${CARD} w-full max-w-md`}>
                <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
                    <h3 className="text-base font-semibold text-slate-900">Transfer ownership</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Select a member to become the new owner of <span className="font-medium text-slate-700">{workspaceTitle}</span>.
                        You'll be demoted to Admin.
                    </p>

                    <div className="relative mt-4">
                        <TextInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search members"
                            className="pl-9"
                        />
                        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>

                    <div className="mt-3 space-y-1.5">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((m) => (
                                <button
                                    key={m._id}
                                    onClick={() => setSelectedMemberId(m._id)}
                                    className={`flex w-full items-center justify-between border px-3 py-2 text-left transition-colors ${selectedMemberId === m._id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-[#E5E7EB] hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                            {initialOf(m.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">{m.name}</p>
                                            <p className="truncate text-xs text-slate-500">{m.email}</p>
                                        </div>
                                    </div>
                                    {selectedMemberId === m._id && (
                                        <Check className="h-4 w-4 shrink-0 text-blue-600" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <p className="py-4 text-center text-sm text-slate-400">No members found.</p>
                        )}
                    </div>

                    {selectedMember && (
                        <div className="mt-4 p-3">
                            <p className="text-xs text-gray-600">
                                Type <span className="font-semibold">Transfer</span> to confirm making{" "}
                                <span className="font-medium">{selectedMember.name}</span> the new owner.
                            </p>
                            <TextInput
                                className="mt-2"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Tranfer"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-[#E5E7EB] px-6 py-4">
                    <GhostButton onClick={onClose} disabled={submitting}>
                        Cancel
                    </GhostButton>
                    <PrimaryButton
                        disabled={!canConfirm || submitting}
                        onClick={() => onConfirm(selectedMemberId)}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Transferring…
                            </>
                        ) : (
                            <>
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Transfer ownership
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}

// Delete workspace modal
function DeleteWorkspaceModal({ workspaceTitle, onClose, onConfirm, submitting }) {
    const [confirmText, setConfirmText] = useState("");
    const canDelete = confirmText === workspaceTitle;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className={`${CARD} w-full max-w-md p-6`}>
                <h3 className="mt-4 text-base font-semibold text-slate-900">Delete workspace</h3>
                <p className="mt-1.5 text-sm text-gray-600">
                    This permanently deletes <span className="font-medium text-slate-700">{workspaceTitle}</span>,
                    all its projects, tasks, and activity history. This action can't be undone.
                </p>
                <div className="mt-4">
                    <FieldLabel>
                        Type <span className="text-gray-800">{workspaceTitle}</span> to confirm
                    </FieldLabel>
                    <TextInput
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={workspaceTitle}
                    />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <GhostButton onClick={onClose} disabled={submitting}>
                        Cancel
                    </GhostButton>
                    <button
                        disabled={!canDelete || submitting}
                        onClick={onConfirm}
                        className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            <>
                                Delete workspace
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main page
export default function ProjectSettings() {
    const [workspaces, setWorkspaces] = useState([]);
    const [workspacesLoading, setWorkspacesLoading] = useState(true);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

    const [workspaceLoading, setWorkspaceLoading] = useState(false);
    const [workspaceError, setWorkspaceError] = useState("");
    const [workspace, setWorkspace] = useState(null);

    // Editable field state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Danger zone state
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [transferSubmitting, setTransferSubmitting] = useState(false);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    const isDirty = useMemo(() => {
        if (!workspace) return false;
        return (
            title !== workspace.title ||
            description !== (workspace.description || "") ||
            dueDate !== (workspace.dueDate || "")
        );
    }, [title, description, dueDate, workspace]);

    // Fetch workspace list on mount
    useEffect(() => {
        setWorkspacesLoading(true);
        // e.g. api.get("/api/workspaces").then(res => setWorkspaces(res.data))
        const timer = setTimeout(() => {
            setWorkspaces(MOCK_WORKSPACES);
            setWorkspacesLoading(false);
            setSelectedWorkspaceId(MOCK_WORKSPACES[0]._id);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Fetch selected workspace's current data
    useEffect(() => {
        if (!selectedWorkspaceId) return;

        setWorkspaceLoading(true);
        setWorkspaceError("");
        setFieldErrors({});

        // e.g. api.get(`/api/workspaces/${selectedWorkspaceId}`).then(res => ...)
        const timer = setTimeout(() => {
            const data = MOCK_WORKSPACE_DETAILS[selectedWorkspaceId];
            if (!data) {
                setWorkspaceError("Unable to load this workspace. Please try again.");
                setWorkspace(null);
                setWorkspaceLoading(false);
                return;
            }
            setWorkspace(data);
            setTitle(data.title);
            setDescription(data.description || "");
            setDueDate(data.dueDate || "");
            setWorkspaceLoading(false);
        }, 450);

        return () => clearTimeout(timer);
    }, [selectedWorkspaceId]);

    const validateFields = () => {
        const errors = {};

        if (!title.trim()) {
            errors.title = "Workspace title is required";
        } else if (title.trim().length < 3) {
            errors.title = "Title must be at least 3 characters";
        } else if (title.trim().length > 30) {
            errors.title = "Title must be under 30 characters";
        }

        if (description.length > 100) {
            errors.description = "Description must be under 100 characters";
        }

        if (dueDate) {
            const selected = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected < today) {
                errors.dueDate = "Due date can't be in the past";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        setSaving(true);
        try {
            // e.g. await api.patch(`/api/workspaces/${selectedWorkspaceId}`, { title, description, dueDate })
            await new Promise((resolve) => setTimeout(resolve, 700));
            setWorkspace((prev) => ({ ...prev, title, description, dueDate }));
            toast.success("Workspace settings saved");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        if (!workspace) return;
        setTitle(workspace.title);
        setDescription(workspace.description || "");
        setDueDate(workspace.dueDate || "");
        setFieldErrors({});
    };

    const handleTransferOwnership = async (newOwnerId) => {
        setTransferSubmitting(true);
        try {
            // e.g. await api.patch(`/api/workspaces/${selectedWorkspaceId}/owner`, { newOwnerId })
            await new Promise((resolve) => setTimeout(resolve, 800));
            setWorkspace((prev) => ({
                ...prev,
                owner: newOwnerId,
                members: prev.members.map((m) => ({
                    ...m,
                    role: m._id === newOwnerId ? "Owner" : m.role === "Owner" ? "Admin" : m.role,
                })),
            }));
            toast.success("Ownership transferred");
            setShowTransferModal(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to transfer ownership");
        } finally {
            setTransferSubmitting(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        setDeleteSubmitting(true);
        try {
            // e.g. await api.delete(`/api/workspaces/${selectedWorkspaceId}`)
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("Workspace deleted");
            setShowDeleteModal(false);
            setWorkspaces((prev) => prev.filter((w) => w._id !== selectedWorkspaceId));
            setSelectedWorkspaceId(null);
            setWorkspace(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete workspace");
        } finally {
            setDeleteSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
            {showTransferModal && workspace && (
                <TransferOwnershipModal
                    members={workspace.members}
                    currentOwnerId={workspace.owner}
                    workspaceTitle={workspace.title}
                    onClose={() => setShowTransferModal(false)}
                    onConfirm={handleTransferOwnership}
                    submitting={transferSubmitting}
                />
            )}

            {showDeleteModal && workspace && (
                <DeleteWorkspaceModal
                    workspaceTitle={workspace.title}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteWorkspace}
                    submitting={deleteSubmitting}
                />
            )}

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <span>SprintLab</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-600">Project settings</span>
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Project settings</h1>

                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Back to dashboard
                    </Link>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Manage workspace details, ownership, and deletion.
                </p>

                {/* Workspace selector */}
                <div className={`${CARD} mt-6 p-4 sm:p-5`}>
                    <FieldLabel>Workspace</FieldLabel>
                    <WorkspaceSelector
                        workspaces={workspaces}
                        selectedId={selectedWorkspaceId}
                        onSelect={setSelectedWorkspaceId}
                        loading={workspacesLoading}
                    />
                </div>

                {/* Loading / error / empty states */}
                {workspaceLoading ? (
                    <div className={`${CARD} mt-6 flex items-center gap-2 p-6 text-sm text-slate-500`}>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        Loading workspace details…
                    </div>
                ) : workspaceError ? (
                    <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {workspaceError}
                    </div>
                ) : !workspace ? (
                    <div className={`${CARD} mt-6 p-6 text-sm text-slate-500`}>
                        Select a workspace above to manage its settings.
                    </div>
                ) : (
                    <div className="mt-6 space-y-6">
                        {/* General settings */}
                        <div className={`${CARD} p-6`}>
                            <SectionHeader
                                eyebrow="General"
                                title="Workspace details"
                                description="Update the title, description, and due date shown across SprintLab."
                            />

                            <div className="space-y-4">
                                <div>
                                    <FieldLabel hint={`${title.length}/30`}>Title</FieldLabel>
                                    <div className="relative">
                                        <TextInput
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Workspace title"
                                            maxLength={30}
                                            error={!!fieldErrors.title}
                                        />
                                    </div>
                                    <ErrorText>{fieldErrors.title}</ErrorText>
                                </div>

                                <div>
                                    <FieldLabel hint={`${description.length}/100`}>Description</FieldLabel>
                                    <TextArea
                                        rows={4}
                                        maxLength={100}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What is this workspace for?"
                                        error={!!fieldErrors.description}
                                    />
                                    <ErrorText>{fieldErrors.description}</ErrorText>
                                </div>

                                <div className="sm:w-64">
                                    <FieldLabel>Due date</FieldLabel>
                                    <div className="relative">
                                        <TextInput
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            error={!!fieldErrors.dueDate}
                                            className="pl-9"
                                        />
                                        <CalendarClock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    </div>
                                    <ErrorText>{fieldErrors.dueDate}</ErrorText>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-400">
                                {isDirty ? "You have unsaved changes" : "All changes saved"}
                            </p>
                            <div className="flex gap-2">
                                <GhostButton onClick={handleDiscard} disabled={!isDirty || saving}>
                                    Discard
                                </GhostButton>
                                <PrimaryButton onClick={handleSave} disabled={!isDirty || saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-3.5 w-3.5" />
                                            Save changes
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* Members preview */}
                        <div className={`${CARD} p-6`}>
                            <SectionHeader eyebrow="Team" title="Workspace members" />
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {workspace.members.map((m) => (
                                    <div
                                        key={m._id}
                                        className="flex items-center justify-between border border-[#E5E7EB] px-3 py-2"
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                {initialOf(m.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">{m.name}</p>
                                                <p className="truncate text-xs text-slate-500">{m.email}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 border px-2 py-0.5 text-[11px] font-medium ${m.role === "Owner"
                                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                                : "border-[#E5E7EB] bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {m.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div className={`${CARD} border-red-200`}>
                            <div className="divide-y divide-[#E5E7EB]">
                                <div className="flex flex-col items-start justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Transfer ownership</p>
                                        <p className="mt-1 max-w-md text-sm text-slate-500">
                                            Hand over this workspace to another member. You'll be demoted to Admin.
                                        </p>
                                    </div>
                                    <GhostButton
                                        onClick={() => setShowTransferModal(true)}
                                        className="shrink-0"
                                    >
                                        <ArrowRightLeft className="h-3.5 w-3.5" />
                                        Transfer ownership
                                    </GhostButton>
                                </div>

                                <div className="flex flex-col items-start justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Delete workspace</p>
                                        <p className="mt-1 max-w-md text-sm text-slate-500">
                                            Permanently delete this workspace and everything in it. This cannot be undone.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="shrink-0 items-center gap-1.5 border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        Delete workspace
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}