import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

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

            workspace.members.push({ user: user._id, role });
            await workspace.save();

            return res.status(200).json({
                message: "User added to the workspace successfully"
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