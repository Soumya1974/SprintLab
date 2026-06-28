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