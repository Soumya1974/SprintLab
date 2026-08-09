import express from "express";
import { handleGetUserData } from "../controllers/userControllers/userDataController.js";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { updateProfile } from "../controllers/userControllers/uploadUserProfile.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.get('/profile/get-userdata', handleAccessToken, handleGetUserData);
userRouter.put('/profile', handleAccessToken, upload.single("profilePicture"), updateProfile);

export default userRouter;