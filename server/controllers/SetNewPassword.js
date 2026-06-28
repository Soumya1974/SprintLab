import { User } from "../models/userDbSchema.js";
import bcrypt from "bcrypt";

export const handleSetNewPassword = async (req, res) => {
    try{
        const { newPassword, email } = req.body;

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

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userData.password = hashedPassword;

        await  userData.save();

        return res.status(200).json({
            message: "Password Updated"
        });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}