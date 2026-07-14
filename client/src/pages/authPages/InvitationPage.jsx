import axios from "axios";
import { Check, X, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function InvitationPage() {

    const [invitationData, setInvitationData] = useState(null);

    const { token } = useParams();
    const navigate = useNavigate();

    const setInviteToken = useInvitationStore(
        (state) => state.setInviteToken
    );


    const handleGetInvitationData = async () => {
        try{
            const response = await axios.post('/api/getInvitationData');
        }
        catch(err) {

        }
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">

                    <Wrench className="h-5 w-5 text-blue-600 shrink-0" />

                    <span className="text-xl font-semibold text-slate-900">SprintLab</span>
                </div>

                <div className="bg-white shadow-xl border border-slate-200 p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-lg font-semibold text-slate-900 mb-2">
                            You've been invited to SprintLab
                        </h1>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            <span className="font-medium text-slate-900">{inviterName}</span> invited you to join{" "}
                            <span className="font-medium text-slate-900">{workspaceName}</span> workspace
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-sm text-slate-500">Role:</span>
                        <span className="text-sm font-medium text-indigo-600 capitalize">{role}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">

                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">
                            <X size={16} />
                            Reject
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                            <Check size={16} />
                            Accept
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                        You need to login or sign up before joining this workspace.
                    </p>
                </div>
            </div>
        </div>
    );
}