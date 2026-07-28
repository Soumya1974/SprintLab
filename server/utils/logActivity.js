import { Activity } from "../models/activityDbSchema.js";

export const logActivity = async ({
  workspaceId,
  userId,
  action,
  targetId,
  targetType,
  details = {},
}) => {
  try {
    const activity = await Activity.create({
      workspaceId,
      userId,
      action,
      targetId,
      targetType,
      details,
    });

    return activity;
  } catch (err) {
    console.error("Activity Log Error:", err.message);
    throw err;
  }
};