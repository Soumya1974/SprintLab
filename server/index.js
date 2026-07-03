import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import workspaceRouter from "./routes/workSpaceRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use('/api', authRouter);
app.use('/api', workspaceRouter);

connectDb();
app.listen(port, () => {
    console.log(`Server is live at port: ${port}`);
})