import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceData",
        required: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    role: {
        type: String,
        enum: ["team", "viewer"],
        default: "viewer"
    },

    token: {
        type: String,
        unique: true,
        sparse: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "expired"],
        default: "pending"
    },

    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required: true
    }

}, { timestamps: true });

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model(
    "invitationData",
    invitationSchema
);