import { User } from "../models/userDbSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { otpEmailTemplate } from "../templates/otpEmailTemplate.js"

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASS_CODE,
    }
});

// Generate 6 digit otp
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

export const handleOtpVerification = async (req, res) => {

    try {
        const { email, otp } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({ message: "User not found" });
        }

        if (userData.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (userData.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, userData.otp);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const accessToken = jwt.sign({ id: userData._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        )

        const refreshToken = jwt.sign({ id: userData._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"

            }
        )

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        userData.isVerified = true;
        userData.otp = undefined;
        userData.otpExpiry = undefined;
        userData.refreshToken = hashedRefreshToken;

        await userData.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Email verified successfully",
            user: {
                name: userData.name,
                email: userData.email,
            },
            accessToken,
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

export const handleResendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified",
            });
        }

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.otp = hashedOtp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        await transporter.sendMail({
            from: `"SprintLab" <${process.env.EMAIL_ID}>`,
            to: email,
            subject: "SprintLab Verification Code",
            text: `Your OTP is ${otp}`,
            html: otpEmailTemplate(otp, {
                expiresInMinutes: 10,
            }),
        });

        return res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};