import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({

    workspaceData: {
        type: String,
        required: true,
        unique: true
    },
    notes: {
        type: String
    },
    version: {
        type: Number,
        default: 1
    },
}, { timestamps: true });

export const Notes = mongoose.model("notesData", notesSchema);

