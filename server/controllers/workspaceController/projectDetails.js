import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

export const handleProjectDetails = async (req, res) => {
    try {
        const { title, description, color, dueDate } = req.body;
        const owner = req.user.id;

        const projectExists = await Workspace.findOne({ title });

        if(projectExists) return res.status(400).json({
            message: "Project name already exists"
        })

        const workspaceData = await Workspace.create({
            title,
            description,
            color,
            dueDate,
            owner,
            members: [owner]
        });

        return res.status(201).json({
            message: "Workspace created successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

export const handleGetProjectData = async (req, res) => {
    try{
        const userProjects = await Workspace.find({
            owner: req.user.id
        });

        if(!userProjects) return res.status(400).json({
            message: "No workspaces found"
        })

        res.status(200).json({
            userProjects
        })

    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }
}