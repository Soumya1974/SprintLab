import { User } from "../../models/userDbSchema.js";

export const handleGetUserData = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id).select("-password -refreshToken -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry -avatarPublicId");

        if (!user) return res.status(400).json({
            message: "No users found"
        })

        return res.status(200).json({
            user
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }
}

export const handleGetUserProfileById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password -refreshToken -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry -avatarPublicId");

        if (!user) return res.status(444 || 404).json({
            message: "User profile not found"
        });

        return res.status(200).json({
            user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || "Failed to fetch user profile"
        });
    }
};