import express from "express";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { handleGetProjectData, handleProjectDetails } from "../controllers/workspaceController/projectDetails.js";
import { handleGetTasks, handlePostTask, handleUpdateTaskStatus } from "../controllers/workspaceController/taskDetails.js";
import { handleGetNotes, handleNotesData } from "../controllers/workspaceController/notesDetails.js";
import { handleSendInvitation } from "../controllers/workspaceController/invitationDetails.js";
import { handleValidEmail } from "../middlewares/authMiddlewares.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/workspaces', handleAccessToken, handleProjectDetails);
workspaceRouter.get('/workspaces/get-projects', handleAccessToken, handleGetProjectData);

workspaceRouter.post('/workspaces/add-task/:workspaceData', handleAccessToken, handlePostTask);
workspaceRouter.get('/workspaces/get-task/:workspaceData', handleAccessToken, handleGetTasks);
workspaceRouter.patch('/tasks/:taskId/:workspaceData/status', handleAccessToken, handleUpdateTaskStatus);

workspaceRouter.put('/post-notes/:workspaceData',handleAccessToken, handleNotesData);
workspaceRouter.get('/get-notes/:workspaceData',handleAccessToken, handleGetNotes);


workspaceRouter.post('/workspaces/invite', handleAccessToken, handleValidEmail, handleSendInvitation);

export default workspaceRouter;