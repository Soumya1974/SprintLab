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
}, { timestamps: true });

export const Notes = mongoose.model("notesData", notesSchema);

