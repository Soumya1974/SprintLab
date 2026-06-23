import mongoose from "mongoose";

export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");
    }
    catch(err) {
        console.log("failed to connect", err);
    }
}