import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true
    },
    taskId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    action: {
        type: String,
        require: true
    }
}, { timestamps: true });

export const Activity = mongoose.model("activityData", activitySchema);