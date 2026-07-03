import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Project } from "../../models/projectDbSchema.js";

export const handleGetTaskData = async (req, res) => {
    try {
        const { title, description, dueDate, priority, color } = req.body;

        const workSpace = await Workspace.findById(req.params.id)
            .populate("dueDate")
            .populate("members.user", "name email avatar")

        if(!workSpace) return res.status(400).json({
            message: "Workspace not found",
        })

        const members = workSpace.members.find(
            member => member.user.toString() == req.user.id
        );

        if(!members || members.role !== "team"){
            return res.status(400).json({
                message: "Viewers are not allowed to update tasks"
            })
        }


    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}