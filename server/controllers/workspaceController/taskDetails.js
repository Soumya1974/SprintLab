import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Project } from "../../models/projectDbSchema.js";

export const handlePostTask = async (req, res) => {
    try {
        const id = req.params.workspaceData;

        const { title, description, dueDate, priority, color } = req.body;

        const workSpace = await Workspace.findById(id)
            .populate("dueDate")
            .populate("members.user", "name email avatar")

        if (!workSpace) return res.status(400).json({
            message: "Workspace not found",
        })

        const members = workSpace.members.find(
            member => member.user._id.toString() === req.user.id
        );

        if (!members || members.role === "viewer") {
            return res.status(400).json({
                message: "Viewers are not allowed to update tasks"
            })
        }

        const taskData = await Project.create({
            title,
            description,
            dueDate,
            priority,
            color,
            workflowId: id,
            createdBy: req.user.id
        })

        res.status(200).json({
            message: "Task created successfully"
        })
    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: err.message
        });
    }
}

export const handleGetTasks = async (req, res) => {
    try {
        const workflowId = req.params.workspaceData;

        const projectData = await Project.find({ workflowId })

        if (!projectData) return res.status(400).json({
            message: "Task details not found"
        })

        res.status(200).json({
            projectData
        })
    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: err.message
        });
    }
}

export const handleUpdateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Project.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.status = status;

        await task.save();

        if (task.status == 'todo') {
            res.status(200).json({
                message: `Task ${task.title} is set to todo`
            });
        }
        res.status(200).json({
            message: `Task ${task.title} is set to done`
        });
    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: err.message
        });
    }
}