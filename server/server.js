import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./src/config/mongodb.js";

const app = express();

const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});