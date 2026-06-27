import express from "express";
import { handleUserSignup, handleUserLogin, handleCreateNewAccessToken, handleUserLogout } from "../controllers/authControllers.js";
import { handleValidSignUp, handleValidLogin } from "../middlewares/authMiddlewares.js";
import { handleOtpVerification, handleResendOtp } from "../controllers/emailVerification.js";

const authRouter = express.Router();

authRouter.post('/signup', handleValidSignUp, handleUserSignup);
authRouter.post('/login', handleValidLogin, handleUserLogin);
authRouter.post('/refresh', handleCreateNewAccessToken);
authRouter.post('/logout', handleUserLogout);
authRouter.post('/verify-otp', handleOtpVerification);
authRouter.post('/resend-otp', handleResendOtp);

export default authRouter;