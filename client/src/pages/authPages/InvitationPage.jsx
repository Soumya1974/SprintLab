import { Check, X, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";

export default function InvitationPage() {
    const [invitationData, setInvitationData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const setInviteToken = useAuthStore(
        (state) => state.setInviteToken
    );
    const accessToken = useAuthStore(
        (state) => state.accessToken
    )

    const handleGetInvitationData = async () => {
        try {
            const response = await api.get(
                `/api/invitations/${token}`
            );

            setInvitationData(response.data);
        } catch (err) {
            toast.error("Invitation not found or expired");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setSubmitting(true);
        if (accessToken) {
            try {
                const response = await api.post(`api/accept-invitations/${token}`, {}, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1000);
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
        else {
            setInviteToken(token);
            navigate("/login");
        }

    };

    const handleReject = () => {
        if (accessToken) {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    };

    useEffect(() => {
        handleGetInvitationData();
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <Wrench className="h-5 w-5 text-blue-600 shrink-0" />
                    <span className="text-xl font-semibold text-slate-900">
                        SprintLab
                    </span>
                </div>

                <div className="bg-white shadow-xl border border-slate-200 p-8">
                    {isLoading ? (
                        <>
                            <div className="flex flex-col items-center mb-6">
                                <div className="h-6 w-56 bg-slate-200 rounded animate-pulse mb-4"></div>
                                <div className="h-4 w-72 bg-slate-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                            </div>

                            <div className="flex justify-center mb-6">
                                <div className="h-8 w-28 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <div className="flex-1 h-11 bg-slate-200 rounded-lg animate-pulse"></div>
                                <div className="flex-1 h-11 bg-slate-200 rounded-lg animate-pulse"></div>
                            </div>

                            <div className="flex justify-center">
                                <div className="h-3 w-64 bg-slate-200 rounded animate-pulse"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h1 className="text-lg font-semibold text-slate-900 mb-2">
                                    You've been invited to SprintLab
                                </h1>

                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <span className="font-medium text-slate-900">
                                        {invitationData?.invitation?.invitedBy}
                                    </span>{" "}
                                    invited you to join{" "}
                                    <span className="font-medium text-slate-900">
                                        {invitationData?.invitation?.workspaceName}
                                    </span>{" "}
                                    workspace
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className="text-sm text-slate-500">
                                    Assigned Role:
                                </span>

                                <span className="text-sm font-medium text-indigo-600 capitalize">
                                    {invitationData?.invitation?.role}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={handleReject}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors"
                                >
                                    <X size={16} />
                                    Reject
                                </button>

                                <button
                                    onClick={handleAccept}
                                    disabled={submitting}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-colors ${submitting
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Accepting...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Accept
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 text-center leading-relaxed">
                                <span className="font-semibold text-black">Note: </span>
                                You need to login or sign up before joining
                                this workspace.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}