import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Invitation } from "../../models/invitationDbSchema.js";
import crypto from "crypto";

export const handleSendInvitation = async (req, res) => {
    try{
        const { email, role } = req.body;
        const workspaceData = req.params.workspaceData;
        const { id } = req.user;

        const workspace = await Workspace.findById(workspaceData);

        if(!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            })
        }

        const members = workspace.members.find(member => member.user._id.toString() === id);

        if(!members || members.role === "viewer" || members.role === "team" && workspace.owner.toString() !== id) {
            return res.status(403).json({
                message: "You are not authorized to send invitations"
            })
        }

        const user = await User.findOne({ email });

        if(user){
            const isAlreadyMember = workspace.members.some(member => member.user.toString() === user._id.toString());

            if(isAlreadyMember){
                return res.status(400).json({
                    message: "User is already a member of the workspace"
                })
            }

            const isInvited = await Invitation.findOne({ workspaceId: workspace._id, email: user.email });

            if(isInvited){
                return res.status(400).json({
                    message: "User has already been invited to the workspace"
                })
            }

            const token = crypto.randomBytes(6).toString("hex");
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

            const invitation = new Invitation({
                workspaceId: workspace._id,
                email: user.email,
                role: role,
                token: token,
                expiresAt: expiresAt,
                invitedBy: id
            });

            await invitation.save();

            return res.status(200).json({
                message: "Invitation sent successfully"
            })
        }
    }

    catch(err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}