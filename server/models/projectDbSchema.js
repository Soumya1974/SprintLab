import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    color: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: "Todo"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required: true,
    },
    dueDate: {
        type: Date,
        default: null
    },
    workflowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceData",
        required: true,
    }
}, { timestamps: true });

export const Project = mongoose.model("projectData", projectSchema);