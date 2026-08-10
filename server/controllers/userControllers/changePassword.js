import { User } from "../../models/userDbSchema.js";
import bcrypt from "bcrypt";

export const handleChangeCurrentPassword = async (req, res) => {
    try {
        const { id } = req.user;
        const {
            current,
            confirmPassword
        } = req.body.passwords;

        const userData = await User.findById(id);

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

        const matchedPassword = await bcrypt.compare(current, userData.password);

        if (!matchedPassword) return res.status(401).json({
            message: "Incorrect password",
        })

        const hashedPassword = await bcrypt.hash(confirmPassword, 10);

        userData.password = hashedPassword;

        await userData.save();

        return res.status(200).json({
            message: "Password updated successfully",
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || "Failed to change current password"
        });
    }
}