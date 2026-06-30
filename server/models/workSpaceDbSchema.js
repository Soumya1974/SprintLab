import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    color: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData"
    },
    dueDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        default: "pending"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
    }]
}, { timestamps: true });

workspaceSchema.index(
    {owner: 1, title: 1}, 
    {unique: true}
);

export const Workspace = mongoose.model("workspaceData", workspaceSchema);