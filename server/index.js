import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import workspaceRouter from "./routes/workSpaceRoutes.js";
import { initializeSocket } from "./socket.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", workspaceRouter);
app.use("/api", userRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDb();

server.listen(port, () => {
  console.log(`Server is live at port: ${port}`);
});