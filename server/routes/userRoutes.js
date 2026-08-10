import express from "express";
import { handleGetUserData, handleGetUserProfileById } from "../controllers/userControllers/userDataController.js";
import { handleAccessToken } from "../middlewares/accessTokenMiddleware.js";
import { updateProfile } from "../controllers/userControllers/uploadUserProfile.js";
import upload from "../middlewares/upload.js";
import { handleValidPasswordChange } from "../middlewares/authMiddlewares.js";
import { handleChangeCurrentPassword } from "../controllers/userControllers/changePassword.js";

const userRouter = express.Router();

userRouter.get('/profile/get-userdata', handleAccessToken, handleGetUserData);
userRouter.get('/profile/:userId', handleAccessToken, handleGetUserProfileById);
userRouter.put('/profile', handleAccessToken, upload.single("profilePicture"), updateProfile);
userRouter.patch('/profile/account/change-password', handleAccessToken, handleValidPasswordChange, handleChangeCurrentPassword);

export default userRouter;