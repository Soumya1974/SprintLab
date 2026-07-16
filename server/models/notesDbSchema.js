import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    notes: {
        type: String
    },
    version: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

export const Notes = mongoose.model("notesData", notesSchema);

