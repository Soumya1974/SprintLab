import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
    status: {
        type: String,
        default: "pending"
    },
    createdBy: {
        type: String,
        required: true,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const Project = mongoose.model("projectData", projectSchema);