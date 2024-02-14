import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";


import { adminRouter } from "./routes/admin.js";
import { portfolioRouter } from "./routes/portfolio.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", adminRouter);
app.use("/portfolio", portfolioRouter);

mongoose.connect("mongodb://127.0.0.1:27017/neonProject");

app.listen(4001, ()=> {
    console.log("Server Running");
})