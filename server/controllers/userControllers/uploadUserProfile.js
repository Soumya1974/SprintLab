import { User } from "../../models/userDbSchema.js";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const { id }  = req.user;

        const {
            name,
            bio,
            gender,
        } = req.body;

        const updateData = {};

        if (name !== undefined) {
            const trimmedName = name.trim();

            if (!trimmedName) {
                return res.status(400).json({
                    message: "Name cannot contain only spaces",
                });
            }

            updateData.name = trimmedName;
        }

        if (bio !== undefined) {
            const trimmedBio = bio.trim();

            if (bio.length > 300) {
                return res.status(400).json({
                    message: "Bio cannot exceed 300 characters",
                });
            }

            updateData.bio = trimmedBio;
        }

        if (gender !== undefined) {
            const allowedGenders = [
                "Male",
                "Female",
                "Prefer not to say",
            ];

            if (!allowedGenders.includes(gender)) {
                return res.status(400).json({
                    message: "Invalid gender",
                });
            }

            updateData.gender = gender;
        }

        if (req.file) {
            // Upload new image
            const result = await uploadToCloudinary(
                req.file.buffer
            );

            updateData.avatar =
                result.secure_url;

            updateData.avatarPublicId =
                result.public_id;

            // Get old image
            const existingUser = await User.findById(id );

            // Delete old image from Cloudinary
            if (
                existingUser?.avatarPublicId
            ) {
                try {
                    await cloudinary.uploader.destroy(
                        existingUser.avatarPublicId
                    );
                } catch (deleteError) {
                    console.error(
                        "Old image deletion failed:",
                        deleteError
                    );
                }
            }
        }


        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No changes provided",
            });
        }

        const updatedUser =
            await User.findByIdAndUpdate(
                id ,
                {
                    $set: updateData,
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            // user: updatedUser,
        });

    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
};