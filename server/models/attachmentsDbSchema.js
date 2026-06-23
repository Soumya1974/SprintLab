import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    
    taskId: {
        type: String,
        required: true,
        unique: true
    },
    uplodedBy: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
    },
    fileSize: {
        type: String,
    },
    url: {
        type: String,
    }

}, { timestamps: true });

export const Attachments = mongoose.model("attachmentsData", attachmentSchema);