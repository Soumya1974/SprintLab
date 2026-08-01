import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Project } from "../../models/projectDbSchema.js";
import { logActivity } from "../../utils/logActivity.js";
import { io } from "../../socket.js";
import { Activity } from "../../models/activityDbSchema.js";

export const syncWorkspaceStatus = async (workspaceId) => {
    const tasks = await Project.find({ workflowId: workspaceId });
    let newStatus = "Pending";

    if (tasks.length > 0) {
        const allDone = tasks.every((t) => t.status === "done" || t.status === "Done");
        const hasInProgress = tasks.some((t) => t.status === "in-progress" || t.status === "In Progress");

        if (allDone) {
            newStatus = "Done";
        } else if (hasInProgress) {
            newStatus = "In Progress";
        } else {
            newStatus = "Todo";
        }
    } else {
        newStatus = "Pending";
    }

    await Workspace.findByIdAndUpdate(workspaceId, { status: newStatus });
    return newStatus;
};

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

        const projectStatus = await syncWorkspaceStatus(id);

        io.to(id.toString()).emit("workspace:status-updated", {
            workspaceId: id,
            status: projectStatus
        });

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
            message: "Task created successfully",
            projectStatus
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

        const projectStatus = await syncWorkspaceStatus(workspaceData);

        io.to(workspaceData.toString()).emit("workspace:status-updated", {
            workspaceId: workspaceData,
            status: projectStatus
        });

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

        res.status(200).json({
            message: `Task ${task.title} is set to ${task.status}`,
            projectStatus
        });
    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: err.message
        });
    }
}