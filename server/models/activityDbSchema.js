import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkspaceData",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "WORKSPACE_CREATED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",

        "TASK_STATUS_CHANGED",
        "TASK_PRIORITY_CHANGED",
        "TASK_DUE_DATE_CHANGED",

        "COMMENT_ADDED",
        "COMMENT_UPDATED",
        "COMMENT_DELETED",

        "NOTES_UPDATED",

        "MEMBER_INVITED",
        "MEMBER_JOINED",
        "MEMBER_REMOVED",
        "ROLE_CHANGED",
      ],
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetType: {
      type: String,
      required: true,
      enum: ["Task", "Comment", "Notes", "Workspace", "Member"],
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model("activityData", activitySchema);