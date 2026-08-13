import { User } from "../../models/userDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";
import { Project } from "../../models/projectDbSchema.js";
import { Activity } from "../../models/activityDbSchema.js";

export const handleProjectDetails = async (req, res) => {
    try {
        const { title, description, color, dueDate } = req.body;
        const owner = req.user.id;

        const projectExists = await Workspace.findOne({ title, owner });

        if (projectExists) return res.status(400).json({
            message: "Project name already exists"
        })

        const workspaceData = await Workspace.create({
            title,
            description,
            color,
            dueDate,
            status: "Pending",
            owner,
            members: [{
                user: owner,
                role: "team",
            }]
        });

        return res.status(201).json({
            message: "Workspace created successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }
}

export const handleGetProjectData = async (req, res) => {
    try {
        const userProjects = await Workspace.find({
            $or: [
                { owner: req.user.id },
                { "members.user": req.user.id }
            ]
        })
            .populate("owner", "name email avatar")
            .populate("members.user", "name email avatar")

        if (!userProjects) return res.status(400).json({
            message: "No workspaces found"
        })

        res.status(200).json({
            userProjects
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }
}

const toStatusKey = (status = "") => {
    const normalized = String(status).toLowerCase().trim();

    if (normalized.includes("progress")) return "in-progress";
    if (normalized === "done") return "done";
    return "todo";
};

export const handleGetWorkspaceDashboard = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { id: userId } = req.user;

        const workspace = await Workspace.findOne({
            _id: workspaceId,
            $or: [
                { owner: userId },
                { "members.user": userId }
            ]
        })
            .populate("owner", "name email avatar")
            .populate("members.user", "name email avatar");

        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found or you don't have access"
            });
        }

        const [tasks, activities] = await Promise.all([
            Project.find({ workflowId: workspaceId })
                .populate("assignedTo", "name email avatar")
                .populate("createdBy", "name email avatar"),

            Activity.find({ workspaceId })
                .populate("userId", "name avatar")
                .sort({ createdAt: -1 })
                .limit(12)
        ]);

        const taskCount = tasks.length;

        const todoCount = tasks.filter(
            (task) => toStatusKey(task.status) === "todo"
        ).length;

        const inProgressCount = tasks.filter(
            (task) => toStatusKey(task.status) === "in-progress"
        ).length;

        const doneCount = tasks.filter(
            (task) => toStatusKey(task.status) === "done"
        ).length;

        const pendingCount = Math.max(
            taskCount -
            (todoCount + inProgressCount + doneCount),
            0
        );

        const today = new Date();

        const overdueCount = tasks.filter((task) => {

            if (
                !task.dueDate ||
                toStatusKey(task.status) === "done"
            ) {
                return false;
            }

            return new Date(task.dueDate) < today;

        }).length;


        const completionRate =
            taskCount > 0
                ? Math.round((doneCount / taskCount) * 100)
                : 0;


        const dueDate = workspace.dueDate
            ? new Date(workspace.dueDate)
            : null;


        const memberTaskCounts = workspace.members.map((member) => {

            const memberId =
                member.user?._id?.toString?.() ||
                member.user?.toString?.();

            const assignedTasks = tasks.filter(
                (task) =>
                    task.assignedTo?._id?.toString?.() === memberId
            ).length;

            return {
                ...member.toObject(),
                user: member.user,
                assignedTasks,
            };
        });

        return res.status(200).json({
            success: true,

            workspace: {
                _id: workspace._id,
                title: workspace.title,
                description: workspace.description,
                color: workspace.color,
                status: workspace.status,
                dueDate,
                owner: workspace.owner,
                members: workspace.members,
                createdAt: workspace.createdAt,
                updatedAt: workspace.updatedAt,
            },

            tasks,

            activities,

            metrics: {
                totalTasks: taskCount,
                pending: pendingCount,
                todo: todoCount,
                inProgress: inProgressCount,
                done: doneCount,
                teamMembers: workspace.members.length,
                completionRate,
                overdueTasks: overdueCount,
            },

            chartData: {
                totalTasks: taskCount,
                pending: pendingCount,
                todo: todoCount,
                inProgress: inProgressCount,
                done: doneCount,
            },

            memberTaskCounts,
        });

    } catch (err) {

        console.error("Dashboard error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};