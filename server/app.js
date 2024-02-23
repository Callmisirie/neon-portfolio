import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Grid from "gridfs-stream";


import { updateSignUpRouter } from './routes/updateSignUp.js';
import { adminRouter } from "./routes/admin.js";
import { mangaRouter } from "./routes/manga.js";
import { chapterContentRouter } from './routes/chapterContent.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const password = process.env.MONGO_DB;

mongoose.connect("mongodb+srv://kensirie:"+ password +"@mangacontent.byftaxk.mongodb.net/mangacontent?retryWrites=true&w=majority");

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');

    app.use("/updateSignUp", updateSignUpRouter);
    app.use("/auth", adminRouter);
    app.use("/manga", mangaRouter);
    app.use("/chapterContent", chapterContentRouter);

    app.listen(4001, ()=> {
        console.log("Server Running");
    });
});


