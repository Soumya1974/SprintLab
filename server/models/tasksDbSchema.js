import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({

    projectId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    },
    priority: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        default: null,
        required: true
    },
    labels: {
        type: [String],
        default: []
    },
    assignedTo: {
        type: [String],
        default: []
    },
    dueDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const Tasks = mongoose.model("tasksData", tasksSchema);

