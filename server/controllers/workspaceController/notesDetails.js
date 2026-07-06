import { Notes } from "../../models/notesDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

export const handleNotesData = async (req, res) => {
    try {
        const { workspaceData } = req.params;
        const { notes } = req.body;

        const note = await Notes.findOneAndUpdate(
            { workspaceData },      
            { notes },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            message: "Notes saved successfully",
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
      notes: note.notes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};