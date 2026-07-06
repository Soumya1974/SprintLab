import express from "express";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { handleGetProjectData, handleProjectDetails } from "../controllers/workspaceController/projectDetails.js";
import { handleGetTasks, handlePostTask, handleUpdateTaskStatus } from "../controllers/workspaceController/taskDetails.js";
import { handleGetNotes, handleNotesData } from "../controllers/workspaceController/notesDetails.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/workspaces', handleAccessToken, handleProjectDetails);
workspaceRouter.get('/workspaces/get-projects', handleAccessToken, handleGetProjectData);

workspaceRouter.post('/workspaces/addtask/:workspaceData', handleAccessToken, handlePostTask);
workspaceRouter.get('/workspaces/get-task/:workspaceData', handleAccessToken, handleGetTasks);
workspaceRouter.patch('/tasks/:taskId/status', handleAccessToken, handleUpdateTaskStatus);

workspaceRouter.post('/post-notes/:workspaceData',handleAccessToken, handleNotesData);
workspaceRouter.get('/get-notes/:workspaceData',handleAccessToken, handleGetNotes);

export default workspaceRouter;