import { User } from "../../models/userDbSchema.js";
import { forgotPasswordEmailTemplate } from "../../templates/forgotPasswordEmailTemplate.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

export const handlePasswordVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) return res.status(400).json({
            message: "User not found"
        })

        if (!userData.isVerified) {
            return res.status(400).json({
                message: "User is not verified",
            });
        }

        if (userData.resetPasswordOtpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, userData.resetPasswordOtp);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        userData.resetPasswordOtp = undefined;
        userData.resetPasswordOtpExpiry = undefined;

        await userData.save();

        return res.status(200).json({
            message: "Otp verified successfully"
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

export const handleResendPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!userData.isVerified) {
            return res.status(400).json({
                message: "User is not verified",
            });
        }

        const otp = generateOtp();

        const hashedOtp = await bcrypt.hash(otp, 10);

        userData.resetPasswordOtp = hashedOtp;
        userData.resetPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await userData.save();

        await transporter.sendMail({
            from: `"SprintLab" <${process.env.EMAIL_ID}>`,
            to: email,
            subject: "SprintLab Verification Code",
            text: `Your OTP is ${otp}`,
            html: forgotPasswordEmailTemplate(otp, {
                expiresInMinutes: 10,
            }),
        });

        return res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

