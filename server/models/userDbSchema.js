import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    avatarPublicId: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Prefer not to say"],
        default: "Male",
    },
    bio: {
        type: String,
        default: "",
        trim: true,
    },
    refreshToken: {
        type: String,
        default: null
    },

    // Email verification
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },

    // Forgot password
    resetPasswordOtp: {
        type: String
    },
    resetPasswordOtpExpiry: {
        type: Date
    },

    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export const User = mongoose.model("userData", userSchema);