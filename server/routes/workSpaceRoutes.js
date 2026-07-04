import express from "express";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { handleGetProjectData, handleProjectDetails } from "../controllers/workspaceController/projectDetails.js";
import { handlePostTask } from "../controllers/workspaceController/taskDetails.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/workspaces', handleAccessToken, handleProjectDetails);
workspaceRouter.get('/workspaces/get-projects', handleAccessToken, handleGetProjectData);

workspaceRouter.post('/workspaces/addtask/:workspaceData', handleAccessToken, handlePostTask);

export default workspaceRouter;