import express from "express";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { handleGetProjectData, handleProjectDetails } from "../controllers/workspaceController/projectDetails.js";

const workspaceRoute = express.Router();

workspaceRoute.post('/workspaces', handleAccessToken, handleProjectDetails);
workspaceRoute.get('/workspaces/get-projects', handleAccessToken, handleGetProjectData);

export default workspaceRoute;