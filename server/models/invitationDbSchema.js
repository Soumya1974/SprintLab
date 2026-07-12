import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceData",
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["team", "viewer"],
    },
    token: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
    }

}, { timestamps: true });

export const Invitation = mongoose.model("invitationData", invitationSchema);