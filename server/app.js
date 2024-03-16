import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


import { updateSignUpRouter } from './routes/updateSignUp.js';
import { adminRouter } from "./routes/admin.js";
import { mangaRouter } from "./routes/manga.js";
import { chapterContentRouter } from './routes/chapterContent.js';
import { managerRouter } from './routes/manager.js';
import { MangaModel, ChapterContentModel } from './models/Manga.js';

const app = express();
const password = process.env.MONGO_DB;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


mongoose.connect("mongodb+srv://kensirie:"+ password +"@mangacontent.byftaxk.mongodb.net/mangacontent?retryWrites=true&w=majority");


app.use("/updateSignUp", updateSignUpRouter);
app.use("/auth", adminRouter);
app.use("/manga", mangaRouter);
app.use("/chapterContent", chapterContentRouter);
app.use("/manager", managerRouter);

app.get("/display/:mangaID", async (req, res) => {
    const id = req.params.mangaID;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid mangaID" });
    }

    try {
        const manga = await MangaModel.findOne({ _id: id });
        if (!manga) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.contentType("image/jpeg");
        res.send(manga.coverImageData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/display/:mangaID/:chapterID/:index", async (req, res) => {
    const {mangaID, chapterID, index} = req.params;
    if (!mongoose.Types.ObjectId.isValid(mangaID)) {
        return res.status(400).json({ message: "Invalid mangaID" });
    }
    
    try {
        const chapterContent = await ChapterContentModel.findOne({mangaID});
        if (!chapterContent){
            return res.status(404).json({message :" Manga not found"});
        }

        const chapter = chapterContent.chapters.find(ch => ch._id.toString() === chapterID);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        
        chapter.pagesData.map((pageData, idx)=> {
            if (idx == index) {
                res.contentType("image/jpeg");
                res.send(pageData);
            }  
        })
        
    } catch (error) {
        console.error(error)
    }
})

app.listen(4001, ()=> {
    console.log("Server Running");
});



