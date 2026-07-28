import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDb } from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import workspaceRouter from "./routes/workSpaceRoutes.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

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

// Create HTTP Server
const server = http.createServer(app);

// Initialize socket.io through function call
initializeSocket(server);

connectDb();

server.listen(port, () => {
  console.log(`Server is live at port: ${port}`);
});