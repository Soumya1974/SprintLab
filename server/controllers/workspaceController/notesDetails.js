import { Notes } from "../../models/notesDbSchema.js";
import { Workspace } from "../../models/workSpaceDbSchema.js";

export const handleNotesData = async (req, res) => {
  try {

    const { id } = req.user;
    const { workspaceData } = req.params;
    const { notes, version } = req.body;

    const workspace = await Workspace.findById(workspaceData);

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

    let  existingNote = await Notes.findOne({ workspaceData });

    if (!existingNote) {
      existingNote = await Notes.create({
        workspaceData,
        notes,
        version: 1,
      });

      return res.status(200).json({
        message: "Notes saved successfully",
      });
    }

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
        returnDocument: "after",
      }
    );

    if (!updatedNote) {
      return res.status(409)
    }
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
      return res.status(400);
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