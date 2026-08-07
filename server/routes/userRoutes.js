import express from "express";
import { handleGetUserData } from "../controllers/userControllers/userDataController.js";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";

const userRouter = express.Router();

userRouter.get('/profile/get-userdata', handleAccessToken, handleGetUserData);

export default userRouter;