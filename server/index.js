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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", workspaceRouter);
app.use("/api/users", userRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDb();

server.listen(port, () => {
  console.log(`Server is live at port: ${port}`);
});