import { Notes } from "../../models/notesDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

export const handleNotesData = async (req, res) => {
  try {
    const { workspaceData } = req.params;
    const { notes, version } = req.body;

    const updatedNote = await Notes.findOneAndUpdate(
      {
        workspaceData,
        version,
      },
      {
        notes,
        $inc: { version: 1 },
      },
      {
        new: true,
      }
    );

    if (!updatedNote) {
      return res.status(409).json({
        message: "This note has already been modified by another user.",
      });
    }
    return res.status(200).json({
      message: "Notes saved successfully",
      note: updatedNote,
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message
    });
  }
}

export const handleGetNotes = async (req, res) => {
  try {
    const { workspaceData } = req.params;

    const note = await Notes.findOne({ workspaceData });

    if (!note) {
      return res.status(200).json({
        notes: "",
      });
    }

    return res.status(200).json({
      notes: note,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};