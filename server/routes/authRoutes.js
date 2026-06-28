import express from "express";
import { handleUserSignup, handleUserLogin, handleCreateNewAccessToken, handleUserLogout } from "../controllers/authControllers.js";
import { handleValidSignUp, handleValidLogin } from "../middlewares/authMiddlewares.js";
import { handleOtpVerification, handleResendOtp } from "../controllers/emailVerification.js";
import { handleUserData } from "../controllers/forgotPassword.js";
import { handlePasswordVerification, handleResendPasswordOtp } from "../controllers/passwordVerification.js";

const authRouter = express.Router();

authRouter.post('/signup', handleValidSignUp, handleUserSignup);
authRouter.post('/signup/verify-otp', handleOtpVerification);
authRouter.post('/signup/resend-otp', handleResendOtp);

authRouter.post('/forgot-password', handleUserData);
authRouter.post('/forgot-password/verify-otp', handlePasswordVerification);
authRouter.post('/forgot-password/resend-otp', handleResendPasswordOtp);


authRouter.post('/login', handleValidLogin, handleUserLogin);
authRouter.post('/refresh', handleCreateNewAccessToken);
authRouter.post('/logout', handleUserLogout);

export default authRouter;