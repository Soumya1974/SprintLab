import { Activity } from "../../models/activityDbSchema.js";

export const handleGetWorkspaceActivities = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const activities = await Activity.find({ workspaceId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};