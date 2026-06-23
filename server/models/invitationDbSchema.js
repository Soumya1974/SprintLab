import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    
    projectId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
    },
    accepted: {
        type: String,
    },
    createdBy: {
        type: String
    }

}, { timestamps: true });

export const Invitation = mongoose.model("invitationData", invitationSchema);