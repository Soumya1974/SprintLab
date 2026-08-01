import express from "express";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { handleGetProjectData, handleProjectDetails, handleGetWorkspaceDashboard } from "../controllers/workspaceController/projectDetails.js";
import { handleDeleteTask, handleGetTasks, handlePostTask, handleUpdateTaskStatus } from "../controllers/workspaceController/taskDetails.js";
import { handleGetNotes, handleNotesData } from "../controllers/workspaceController/notesDetails.js";
import { handleAcceptInvitation, handleGetInvitationDetails, handleSendInvitation } from "../controllers/workspaceController/invitationDetails.js";
import { handleValidEmail } from "../middlewares/authMiddlewares.js";
import { handleGetWorkspaceActivities } from "../controllers/workspaceController/activityDetails.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/workspaces', handleAccessToken, handleProjectDetails);
workspaceRouter.get('/workspaces/get-projects', handleAccessToken, handleGetProjectData);
workspaceRouter.get('/workspaces/dashboard/:workspaceId', handleAccessToken, handleGetWorkspaceDashboard);

workspaceRouter.post('/workspaces/add-task/:workspaceData', handleAccessToken, handlePostTask);
workspaceRouter.get('/workspaces/get-task/:workspaceData', handleAccessToken, handleGetTasks);
workspaceRouter.delete('/tasks/:taskId/:workspaceData', handleAccessToken, handleDeleteTask);
workspaceRouter.patch('/tasks/:taskId/:workspaceData/status', handleAccessToken, handleUpdateTaskStatus);

workspaceRouter.put('/post-notes/:workspaceData',handleAccessToken, handleNotesData);
workspaceRouter.get('/get-notes/:workspaceData', handleGetNotes);


workspaceRouter.post('/workspaces/:workspaceData/invite', handleAccessToken, handleValidEmail, handleSendInvitation);
workspaceRouter.get("/invitations/:token", handleGetInvitationDetails);
workspaceRouter.post("/accept-invitations/:token", handleAccessToken, handleAcceptInvitation);


workspaceRouter.get("/activity/:workspaceId", handleAccessToken, handleGetWorkspaceActivities);

export default workspaceRouter;