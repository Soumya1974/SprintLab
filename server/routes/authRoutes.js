import express from "express";
import { handleUserSignup, handleUserLogin, handleCreateNewAccessToken, handleUserLogout } from "../controllers/authControllers.js";
import { handleValidSignUp, handleValidLogin } from "../middlewares/authMiddlewares.js";
import { handleOtpVerification, handleResendOtp } from "../controllers/emailVerification.js";
import { handleUserData } from "../controllers/forgotPassword.js";
import { handlePasswordVerification } from "../controllers/passwordVerification.js";

const authRouter = express.Router();

authRouter.post('/signup', handleValidSignUp, handleUserSignup);
authRouter.post('/login', handleValidLogin, handleUserLogin);
authRouter.post('/refresh', handleCreateNewAccessToken);
authRouter.post('/logout', handleUserLogout);
authRouter.post('/verify-otp', handleOtpVerification);
authRouter.post('/resend-otp', handleResendOtp);
authRouter.post('/find-account', handleUserData);
authRouter.post('/find-account/verify-otp', handlePasswordVerification);

export default authRouter;