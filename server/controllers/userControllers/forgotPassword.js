import { User } from "../../models/userDbSchema.js";
import { forgotPasswordEmailTemplate } from "../../templates/forgotPasswordEmailTemplate.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


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

export const handleUserData = async (req, res) => {
    try {
        const { email } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        if (!userData.isVerified) {
            return res.status(400).json({
                message: "User is not verified",
            });
        }


        const id = userData._id;
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        const hashedOtp = await bcrypt.hash(otp, 10);

        userData.resetPasswordOtp = hashedOtp;
        userData.resetPasswordOtpExpiry = otpExpiry;

        await transporter.sendMail({
            from: `"SprintLab" <${process.env.EMAIL_ID}>`,
            to: email,
            subject: "SprintLab verification code",
            text: `Your OTP is ${otp}`,
            html: forgotPasswordEmailTemplate(otp, { expiresInMinutes: 10 }),
        });

        await userData.save();

        return res.status(200).json({
            message: "Verify otp to continue",
            email: userData.email
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}