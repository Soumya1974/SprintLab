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
        default: null
    }
}, { timestamps: true });

export const Workspace = mongoose.model("workspaceData", workspaceSchema);