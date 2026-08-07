import { useRef, useState } from "react";
import {
    User,
    Camera,
    Mail,
    MapPin,
    Lock,
    Trash2,
    ShieldCheck,
    Eye,
    EyeOff,
    ChevronRight,
    ChevronLeft,
    Check,
    X,
    Upload,
    AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ImageCropper from "./ImageCropper";
import { getCroppedImg } from "../../utils/cropImage";

const CARD = "border border-[#E5E7EB] bg-white";

const TABS = [
    { key: "general", label: "General" },
    { key: "address", label: "Address" },
    { key: "account", label: "Account" },
];

const GENDERS = ["Male", "Female", "Prefer not to say"];

// At least 8 chars, one uppercase, one lowercase, one number, one special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

function SectionHeader({ eyebrow, title, description }) {
    return (
        <div className="mb-6">
            {eyebrow && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
    );
}

function FieldLabel({ children, hint }) {
    return (
        <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">{children}</label>
            {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
        </div>
    );
}

function TextInput({ error, ...props }) {
    return (
        <input
            {...props}
            className={`w-full border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-600 ${
                error ? "border-rose-400 focus:border-rose-500" : "border-[#E5E7EB]"
            } ${props.className || ""}`}
        />
    );
}

function TextArea(props) {
    return (
        <textarea
            {...props}
            className={`w-full resize-none border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-600 ${props.className || ""}`}
        />
    );
}

function ErrorText({ children }) {
    if (!children) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3 w-3" />
            {children}
        </p>
    );
}

function PrimaryButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="inline-flex items-center gap-1.5 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    );
}

function GhostButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="inline-flex items-center gap-1.5 border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

function AvatarUploader({ name, avatarFile, setAvatarFile, avatarPreview, setAvatarPreview }) {
    const inputRef = useRef(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [rawPreview, setRawPreview] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleFile = (file) => {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and WEBP are allowed");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image must be less than 4MB");
            return;
        }

        const url = URL.createObjectURL(file);
        setRawPreview(url);
        setShowCropper(true);
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex items-center gap-5">
            <div className="group relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-blue-50 text-xl font-semibold text-blue-600">
                    {!avatarPreview ? (
                        <>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                            <span>{initials || "U"}</span>
                        </>
                    ) : (
                        <img
                            src={avatarPreview}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                {showCropper && rawPreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-125 bg-white p-5">
                            <h2 className="mb-4 text-lg font-semibold">Crop profile picture</h2>

                            <div className="relative h-100 w-full">
                                <ImageCropper image={rawPreview} onCropComplete={handleCropComplete} />
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                {!processing && (
                                    <button onClick={() => setShowCropper(false)}>Cancel</button>
                                )}

                                <button
                                    onClick={async () => {
                                        setProcessing(true);
                                        try {
                                            const croppedBlob = await getCroppedImg(
                                                rawPreview,
                                                croppedAreaPixels
                                            );

                                            const croppedUrl = URL.createObjectURL(croppedBlob);
                                            setAvatarPreview(croppedUrl);
                                            setAvatarFile(croppedBlob);
                                            setShowCropper(false);
                                        } catch (error) {
                                            console.error("Cropping failed:", error);
                                        } finally {
                                            setProcessing(false);
                                        }
                                    }}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-1">
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        "Crop"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => inputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/0 text-white opacity-0 transition-all group-hover:bg-slate-900/40 group-hover:opacity-100"
                >
                    <Camera className="h-5 w-5" />
                </button>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <GhostButton onClick={() => inputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5" />
                        Upload photo
                    </GhostButton>
                    {avatarPreview && (
                        <button
                            onClick={() => {
                                setAvatarPreview(null);
                                setAvatarFile(null);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-slate-500 hover:text-rose-600"
                        >
                            <X className="h-3.5 w-3.5" />
                            Remove
                        </button>
                    )}
                </div>
                <p className="mt-2 text-xs text-slate-400">JPG, PNG or WEBP. Max size 4MB.</p>
            </div>
        </div>
    );
}

function GenderPicker({ value, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
                <button
                    key={g}
                    onClick={() => onChange(g)}
                    className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                        value === g
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                    {g}
                </button>
            ))}
        </div>
    );
}

function PasswordField({ label, placeholder, value, onChange, error }) {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <TextInput
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-slate-400 hover:text-slate-600"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            <ErrorText>{error}</ErrorText>
        </div>
    );
}

function DeleteAccountModal({ onClose }) {
    const [confirmText, setConfirmText] = useState("");
    const canDelete = confirmText === "Delete";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className={`${CARD} w-full max-w-md p-6`}>
                <h3 className="mt-4 text-base font-semibold text-slate-900">Delete account</h3>
                <p className="mt-1.5 text-sm text-slate-500">
                    This permanently removes your account, workspaces you own, and all associated data.
                    This action can't be undone.
                </p>
                <div className="mt-4">
                    <FieldLabel>
                        Type <span className="font-mono text-slate-600">Delete</span> to confirm
                    </FieldLabel>
                    <TextInput
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Delete"
                    />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <GhostButton onClick={onClose}>Cancel</GhostButton>
                    <button
                        disabled={!canDelete}
                        className="inline-flex items-center gap-1.5 bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [tab, setTab] = useState("general");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Avatar state
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // General tab state
    const [name, setName] = useState("Soumya Ranjan Sahoo");
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("Male");
    const email = "soumya.sahoo@example.com";

    console.log(name);
    console.log(bio);
    console.log(gender);

    // Address tab state
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });

    const handleAddressChange = (field) => (e) => {
        setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Account tab password state
    const [passwords, setPasswords] = useState({
        current: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({
        current: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = (field) => (e) => {
        setPasswords((prev) => ({ ...prev, [field]: e.target.value }));
        setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validatePasswords = () => {
        const errors = { current: "", newPassword: "", confirmPassword: "" };
        let isValid = true;

        if (!passwords.current) {
            errors.current = "Current password is required";
            isValid = false;
        }

        if (!passwords.newPassword) {
            errors.newPassword = "New password is required";
            isValid = false;
        } else if (!PASSWORD_REGEX.test(passwords.newPassword)) {
            errors.newPassword =
                "Min 8 characters, with uppercase, lowercase, number and special character";
            isValid = false;
        }

        if (!passwords.confirmPassword) {
            errors.confirmPassword = "Please confirm your new password";
            isValid = false;
        } else if (passwords.newPassword !== passwords.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setPasswordErrors(errors);
        return isValid;
    };

    const handleSave = () => {
        
    };

    const handleSaveAddress = () => {
        
    };

    const handleUpdatePassword = () => {
        if (!validatePasswords()) return;
        
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
            {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <span>SprintLab</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-600">Profile settings</span>
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Profile settings
                    </h1>

                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Back to dashboard
                    </Link>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your personal information and account preferences.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                        <div className={`${CARD} p-2`}>
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium transition-colors ${
                                        tab === t.key
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {t.label}
                                    {tab === t.key && <ChevronRight className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                        </div>

                        <div className={`${CARD} mt-4 p-4`}>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                Email verified
                            </div>
                            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                                Your account is secured with email verification and password login.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-9 space-y-6">
                        {tab === "general" && (
                            <>
                                <div className={`${CARD} p-6`}>
                                    <SectionHeader
                                        eyebrow="Profile"
                                        title="Your photo"
                                        description="This is displayed on your profile and across your workspaces."
                                    />
                                    <AvatarUploader
                                        name={name}
                                        avatarFile={avatarFile}
                                        setAvatarFile={setAvatarFile}
                                        avatarPreview={avatarPreview}
                                        setAvatarPreview={setAvatarPreview}
                                    />
                                </div>

                                <div className={`${CARD} p-6`}>
                                    <SectionHeader eyebrow="Profile" title="Personal information" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <FieldLabel>Full name</FieldLabel>
                                            <TextInput
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Email address</FieldLabel>
                                            <div className="relative">
                                                <TextInput value={email} className="pl-9" disabled readOnly />
                                                <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <FieldLabel hint={`${bio.length}/200`}>Bio</FieldLabel>
                                        <TextArea
                                            rows={4}
                                            maxLength={200}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell your team a bit about yourself role, focus areas, or anything worth knowing."
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <FieldLabel>Gender</FieldLabel>
                                        <GenderPicker value={gender} onChange={setGender} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <GhostButton
                                        onClick={() => {
                                            setName("Soumya Ranjan Sahoo");
                                            setBio("");
                                            setGender("Male");
                                            setAvatarPreview(null);
                                            setAvatarFile(null);
                                        }}
                                    >
                                        Discard
                                    </GhostButton>
                                    <PrimaryButton onClick={handleSave}>
                                        <Check className="h-3.5 w-3.5" />
                                        Save changes
                                    </PrimaryButton>
                                </div>
                            </>
                        )}

                        {tab === "address" && (
                            <>
                                <div className={`${CARD} p-6`}>
                                    <SectionHeader
                                        eyebrow="Address"
                                        title="Location details"
                                        description="Used for billing and regional preferences."
                                    />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <FieldLabel>Street address</FieldLabel>
                                            <div className="relative">
                                                <TextInput
                                                    value={address.street}
                                                    onChange={handleAddressChange("street")}
                                                    placeholder="123 MG Road"
                                                    className="pl-9"
                                                />
                                                <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>City</FieldLabel>
                                            <TextInput
                                                value={address.city}
                                                onChange={handleAddressChange("city")}
                                                placeholder="Bhubaneswar"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>State / Province</FieldLabel>
                                            <TextInput
                                                value={address.state}
                                                onChange={handleAddressChange("state")}
                                                placeholder="Odisha"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Postal code</FieldLabel>
                                            <TextInput
                                                value={address.postalCode}
                                                onChange={handleAddressChange("postalCode")}
                                                placeholder="751001"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Country</FieldLabel>
                                            <TextInput
                                                value={address.country}
                                                onChange={handleAddressChange("country")}
                                                placeholder="India"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <GhostButton
                                        onClick={() =>
                                            setAddress({
                                                street: "",
                                                city: "",
                                                state: "",
                                                postalCode: "",
                                                country: "",
                                            })
                                        }
                                    >
                                        Discard
                                    </GhostButton>
                                    <PrimaryButton onClick={handleSaveAddress}>
                                        <Check className="h-3.5 w-3.5" />
                                        Save changes
                                    </PrimaryButton>
                                </div>
                            </>
                        )}

                        {tab === "account" && (
                            <>
                                <div className={`${CARD} p-6`}>
                                    <SectionHeader
                                        eyebrow="Account"
                                        title="Change password"
                                        description="Use a strong password you're not using elsewhere."
                                    />
                                    <div className="space-y-4">
                                        <PasswordField
                                            label="Current password"
                                            placeholder="Enter current password"
                                            value={passwords.current}
                                            onChange={handlePasswordChange("current")}
                                            error={passwordErrors.current}
                                        />
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <PasswordField
                                                label="New password"
                                                placeholder="Enter new password"
                                                value={passwords.newPassword}
                                                onChange={handlePasswordChange("newPassword")}
                                                error={passwordErrors.newPassword}
                                            />
                                            <PasswordField
                                                label="Confirm new password"
                                                placeholder="Re-enter new password"
                                                value={passwords.confirmPassword}
                                                onChange={handlePasswordChange("confirmPassword")}
                                                error={passwordErrors.confirmPassword}
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Must be at least 8 characters and include an uppercase letter,
                                            a lowercase letter, a number, and a special character.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <PrimaryButton onClick={handleUpdatePassword}>
                                            <Lock className="h-3.5 w-3.5" />
                                            Update password
                                        </PrimaryButton>
                                    </div>
                                </div>

                                <div className={`${CARD} border-rose-200 p-6`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                                                Delete account
                                            </h2>
                                            <p className="mt-1 max-w-md text-sm text-slate-500">
                                                Permanently delete your account and all associated workspaces, projects,
                                                and tasks. This cannot be undone.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="inline-flex shrink-0 items-center gap-1.5 border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete account
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}