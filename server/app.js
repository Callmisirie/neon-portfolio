import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";


import { adminRouter } from "./routes/admin.js";
import { mangaRouter } from "./routes/manga.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", adminRouter);
app.use("/manga", mangaRouter);

const password = process.env.MONGO_DB;

mongoose.connect("mongodb+srv://kensirie:"+ password +"@mangacontent.byftaxk.mongodb.net/mangacontent?retryWrites=true&w=majority");

app.listen(4001, ()=> {
    console.log("Server Running");
})