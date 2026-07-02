import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
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
        _id: false,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userData",
            required: true,
        },
        role: {
            type: String,
            enum: ["team", "viewer"],
            default: "viewer",
        }
    }]
}, { timestamps: true });

workspaceSchema.index(
    {owner: 1, title: 1}, 
    {unique: true}
);

export const Workspace = mongoose.model("workspaceData", workspaceSchema);