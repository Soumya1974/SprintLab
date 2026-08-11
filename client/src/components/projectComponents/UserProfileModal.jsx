import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail, User, Info, Loader2, UserCheck, ExternalLink, Calendar } from "lucide-react";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function UserProfileAvatar({ user, size = "md", className = "", children }) {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalPos, setActionModalPos] = useState({ top: 0, left: 0 });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);

  const containerRef = useRef(null);
  const loggedInUser = useWorkspaceStore((state) => state.user);

  if (!user) return children || null;

  const initialUser = typeof user === "object" ? user : { _id: user };
  const userId = initialUser._id || initialUser.id;
  const name = initialUser.name || initialUser.email || "User";
  const avatar = initialUser.avatar;

  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  }[size] || "h-8 w-8 text-xs";

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setActionModalPos({
        top: rect.bottom + window.scrollY + 6,
        left: Math.max(10, rect.left + window.scrollX - 60),
      });
    }
    setActionModalOpen((prev) => !prev);
  };

  const handleSeeProfile = async (e) => {
    e.stopPropagation();
    setActionModalOpen(false);
    setProfileModalOpen(true);

    // If viewing logged-in user, use Zustand store directly
    if (loggedInUser && (loggedInUser._id === userId || loggedInUser.id === userId)) {
      setFetchedUser(loggedInUser);
      setLoading(false);
      setError("");
      return;
    }

    if (!userId) {
      setFetchedUser(initialUser);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/api/users/profile/${userId}`);
      setFetchedUser(response.data.user);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const displayUser = fetchedUser || initialUser;
  const displayName = displayUser.name || displayUser.email || "User";
  const displayAvatar = displayUser.avatar;
  const displayEmail = displayUser.email || "Not available";
  const displayGender = displayUser.gender || "Not specified";
  const displayDate = displayUser.createdAt || "No Data";
  const displayBio = displayUser.bio || "No bio provided.";

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleAvatarClick}
        className={`relative inline-block shrink-0 cursor-pointer ${className}`}
      >
        {children ? (
          children
        ) : (
          <div className={`relative overflow-hidden rounded-full bg-slate-200 text-slate-700 font-semibold border border-slate-300 ${sizeClasses}`}>
            {avatar ? (
              <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {getInitials(name)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Small Action Submodal */}
      {actionModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-transparent"
            onClick={() => setActionModalOpen(false)}
          >
            <div
              style={{ top: actionModalPos.top, left: actionModalPos.left }}
              className="fixed z-50 w-56 border border-slate-300 bg-white p-3 shadow-xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-slate-100">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {avatar ? (
                    <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span>{getInitials(name)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">{name}</p>
                  <p className="truncate text-[11px] text-slate-500">{initialUser.email || "Workspace User"}</p>
                </div>
              </div>

              {/* Action Button: Only See User Profile is clickable */}
              <button
                onClick={handleSeeProfile}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5" />
                  See user profile
                </span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Detailed Squared Profile Modal */}
      {profileModalOpen &&
        createPortal(
          <div
            className="z-50 flex items-center justify-center absolute inset-0 bg-slate-900/40 p-4"
            onClick={() => setProfileModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md border border-slate-300 bg-white shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    User Profile
                  </h3>
                </div>

                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              {/* Main Content */}
              <div className="p-5 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <p className="text-xs font-medium">Fetching user profile...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 border border-rose-200 bg-rose-50 text-rose-700 text-xs">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-4 text-center sm:flex-row sm:items-start sm:text-left">
                      <>
                        <button
                          type="button"
                          onClick={() => displayAvatar && setShowLightbox(true)}
                          disabled={!displayAvatar}
                          className={`group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-blue-600 text-xl font-bold text-white ${displayAvatar ? "cursor-pointer" : "cursor-default"
                            }`}
                        >
                          {displayAvatar ? (
                            <>
                              <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-150 group-hover:bg-slate-900/50 group-hover:opacity-100">
                                <span className="px-1 text-center text-[9px] font-medium leading-tight text-white">
                                  View full image
                                </span>
                              </div>
                            </>
                          ) : (
                            <span>{getInitials(displayName)}</span>
                          )}
                        </button>

                        {showLightbox && displayAvatar && (
                          <div
                            className="z-50 flex items-center justify-center absolute inset-0 bg-slate-900/40 p-4"
                            onClick={() => setShowLightbox(false)}
                          >
                            <div
                              className="relative max-h-[85vh] max-w-[90vw] sm:max-h-[80vh] sm:max-w-[70vw] md:max-w-125"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setShowLightbox(false)}
                                className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center border border-[#E5E7EB] bg-white text-slate-500 transition-colors hover:border-blue-600 hover:text-blue-600 sm:-right-4 sm:-top-4 sm:h-9 sm:w-9"
                              >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>

                              <img
                                src={displayAvatar}
                                alt={displayName}
                                className="max-h-[85vh] max-w-[90vw] object-contain sm:max-h-[80vh] sm:max-w-[70vw] md:max-w-125"
                              />
                            </div>
                          </div>
                        )}
                      </>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-snug text-slate-900">{displayName}</h2>

                        <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{displayEmail}</span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                          <div className="inline-flex items-center gap-1.5 border border-[#E5E7EB] bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            <User className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="whitespace-nowrap">Gender: {displayGender}</span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 border border-[#E5E7EB] bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="whitespace-nowrap">Joined: {formatDate(displayDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio section */}
                    <div>
                      <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Info className="h-3.5 w-3.5 text-slate-400" />
                        Bio & About
                      </h4>
                      <div className="min-h-16 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                        {displayBio || <span className="text-slate-400">No bio added yet.</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
