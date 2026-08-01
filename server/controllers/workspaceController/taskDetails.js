import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Project } from "../../models/projectDbSchema.js";
import { logActivity } from "../../utils/logActivity.js";
import { io } from "../../socket.js";
import { Activity } from "../../models/activityDbSchema.js";

export const handlePostTask = async (req, res) => {
    try {
        const id = req.params.workspaceData;

        const { title, description, dueDate, priority, color, assignedTo } = req.body;

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
                message: "Viewers are not allowed to add tasks"
            })
        }

        const taskData = await Project.create({
            title,
            description,
            dueDate,
            priority,
            color,
            assignedTo: assignedTo || null,
            workflowId: id,
            createdBy: req.user.id
        })

        const activity = await logActivity({
            workspaceId: taskData.workflowId,
            userId: taskData.createdBy,
            action: "TASK_CREATED",
            targetId: taskData.workflowId,
            targetType: "Task",
            details: {
                taskTitle: taskData.title,
            }
        });

        const populatedActivity = await Activity.findById(activity._id).populate("userId", "name avatar");

        io.to(populatedActivity.workspaceId.toString()).emit(
            "activity:new",
            populatedActivity
        );

        res.status(201).json({
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

        const projectData = await Project.find({ workflowId }).populate("assignedTo", "name avatar email");

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
        const { id } = req.user;
        const { taskId, workspaceData } = req.params;
        const status = req.body.status;

        const workspace = await Workspace.findById(workspaceData);

        if (!workspace) return res.status(400).json({
            message: "Workspace not found",
        })

        const members = workspace.members.find(
            member => member.user._id.toString() === id
        );

        if (!members || members.role === "viewer") {
            return res.status(400).json({
                message: "Viewers are not allowed to update tasks"
            })
        }

        const task = await Project.findById(taskId);


        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        const previousStatus = task.status;

        task.status = status;

        await task.save();

        const activity = await logActivity({
            workspaceId: workspace._id,
            userId: id,
            action: "TASK_STATUS_CHANGED",
            targetId: task._id,
            targetType: "Task",
            details: {
                taskTitle: task.title,
                previousStatus: previousStatus,
                currentStatus: task.status,
            }
        });

        const populatedActivity = await Activity.findById(activity._id).populate("userId", "name avatar");

        io.to(populatedActivity.workspaceId.toString()).emit(
            "activity:new",
            populatedActivity
        );

        if (task.status === 'todo') {
            return res.status(200).json({
                message: `Task ${task.title} is set to todo`
            });
        }

        if (task.status === 'in-progress') {
            return res.status(200).json({
                message: `Task ${task.title} is set to progress`
            });
        }

        if (task.status === 'done') {
            res.status(200).json({
                message: `Task ${task.title} is set to done`
            });
        }
    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: err.message
        });
    }
}