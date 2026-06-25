import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', authRouter);

connectDb();
app.listen(port, () => {
    console.log(`Server is live at port: ${port}`);
})