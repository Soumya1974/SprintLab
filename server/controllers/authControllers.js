import { User } from "../models/userDbSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";


//Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sprintlab.support@gmail.com",
        pass: `${process.env.PASS}`,
    }
});

//Generate 6 digit otp
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

export const handleUserSignup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({
            message: "Email already exists"
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        const hashedOtp = await bcrypt.hash(otp, 10);

        const saveUser = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpiry
        });

        await transporter.sendMail({
            from: 'sprintlab.support@gmail.com',
            to: 'soumya1874@gmail.com',
            subject: "Otp verification",
            text: `Your Otp is ${otp}`
        })

        const accessToken = jwt.sign({
            id: saveUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: saveUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await User.findByIdAndUpdate(
            saveUser._id,
            {
                refreshToken: hashedRefreshToken
            }
        )

        res.cookie("refreshToken", refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 //7days

            })

        res.status(201).json({
            message: "User created successfully",
            user: {
                name: saveUser.name,
                email: saveUser.email
            },
            accessToken
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const handleUserLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (!userExists) return res.status(401).json({
            message: "Invalid email or password"
        })

        const matchPassword = await bcrypt.compare(password, userExists.password);

        if (!matchPassword) return res.status(401).json({
            message: "Invalid email or password"
        })

        const accessToken = jwt.sign({
            id: userExists._id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: userExists._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Logged in Successfully",
            user: {
                name: userExists.name,
                email: userExists.email
            },
            accessToken
        });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const handleCreateNewAccessToken = async (req, res) => {

    const getRefreshToken = req.cookies.refreshToken;

    if (!getRefreshToken) return res.status(401).json({
        message: "Missing refreshtoken"
    })

    try {
        const decoded = jwt.verify(getRefreshToken, process.env.JWT_SECRET);

        const getUserData = await User.findById(decoded.id);

        if (!getUserData) return res.status(403).json({
            message: "No such record found"
        })

        const isMatch = await bcrypt.compare(getRefreshToken, getUserData.refreshToken);

        if (!isMatch) return res.status(403).json({
            message: "Refreshtoken didn't matched"
        })

        const accessToken = jwt.sign({
            id: getUserData._id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: getUserData._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        
        await User.findByIdAndUpdate(
            getUserData._id,
            {
                refreshToken: hashedRefreshToken
            }
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            user: {
                name: getUserData.name,
                email: getUserData.email
            },
            accessToken
        });
    }
    catch (err) {
        return res.status(403).json({
            message: "Invalid refresh token"
        });
    }
}

export const handleUserLogout = async (req, res) => {

    const getRefreshToken = req.cookies.refreshToken;

    if(!getRefreshToken) return res.status(204);

    try{
        const decoded = jwt.verify(
            getRefreshToken,
            process.env.JWT_SECRET
        );

        const getUserData = await User.findById(decoded.id);

        if(getUserData){
            getUserData.refreshToken = null,
            await getUserData.save();
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.status(200).json({
            message: "Logged out successfully"
        })
    }
    catch(err) {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(204).json({
            message: "Somthing went wrong"
        });
    }
}