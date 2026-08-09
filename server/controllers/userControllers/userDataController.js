import { User } from "../../models/userDbSchema.js";

export const handleGetUserData = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);

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