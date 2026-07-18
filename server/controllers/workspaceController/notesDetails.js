import { Notes } from "../../models/notesDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

export const handleNotesData = async (req, res) => {
  try {

    const { id } = req.user;
    const workspaceId = req.params.workspaceData;
    const { notes, version } = req.body;

    const workspace = await Workspace.findById(workspaceId);


    if (!workspace) {
      return res.status(400).json({
        message: "Workspace not found",
      });
    }

    const members = workspace.members.find(
      member => member.user._id.toString() === id
    );

    if (!members || members.role === "viewer") {
      return res.status(400).json({
        message: "Viewers are not allowed to add notes"
      })
    }

    let existingNote = await Notes.findOne({ workspaceId });

    if (!existingNote) {
      existingNote = await Notes.create({
        workspaceId,
        notes,
        version: 1,
      });

      return res.status(200).json({
        message: "Notes saved successfully",
        version: existingNote.version
      });
    }

    const updatedNote = await Notes.findOneAndUpdate(
      {
        workspaceId,
        version,
      },
      {
        notes,
        $inc: { version: 1 },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedNote) {
      return res.status(409).json({
        message:
          "This note has been updated by another team member while you were editing."
      });
    }
    return res.status(200).json({
      message: "Notes saved successfully",
      version: updatedNote.version
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
    
    const workspaceId = req.params.workspaceData;
    
    const note = await Notes.findOne({ workspaceId });

    if (!note) {
      return res.status(404).json({
        message: "Notes note found"
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