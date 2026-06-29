import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    color: {
        type: String,
        default: null
    },
    ownerId: {
        type: String,
        unique: true,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
     status: {
        type: String,
        default: "pending"
    },
}, { timestamps: true });

export const Workspace = mongoose.model("workspaceData", workspaceSchema);