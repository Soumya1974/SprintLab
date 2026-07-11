import { User } from "../../models/userModel.js";
import { Workspace } from "../../models/workspaceModel.js";

export const handleSendInvitation = async (req, res) => {
    try{
        const { email, role, workspaceId } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
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