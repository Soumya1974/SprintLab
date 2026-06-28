import { User } from "../models/userDbSchema.js";
import bcrypt from "bcrypt";

export const handlePasswordVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) return res.status(400).json({
            message: "User not found"
        })

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