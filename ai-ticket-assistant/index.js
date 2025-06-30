import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB ✅");
        app.listen(PORT, () => console.log('🚀 Server at http://localhost:3000'))
    })
    .catch((error) => console.error('❌ MongoDB connection error:',error));
