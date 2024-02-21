import express from "express";
import multer from "multer";
import {ChapterContentModel} from "../models/Manga.js";


const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
}); 
const upload = multer({ storage: storage });
const router =  express.Router();


router.get("/", async (req, res)=> {
    try {
        const response = await ChapterContentModel.find({});
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

router.post("/", upload.array("pages"), async (req, res)=> {

    const mangaID = req.body.mangaID;
    const mangaName = req.body.mangaName;
    const chapters = {
        chapterNumber: req.body.chapterNumber,
        title: req.body.title,
        pages: req.files.map((file)=>
            file.path
        )
    };
    const result = {
        mangaID,
        mangaName, 
        chapters 
    }; 
    const mangaContent = await ChapterContentModel.findOne({mangaID});

    if (!mangaContent){     
        try {
            const chapterContent = new ChapterContentModel(result);
            const response =  await chapterContent.save();
            res.json(response)
        } catch (error) {
            res.json(error)
        }
    } else if (mangaContent) {
        try {
            const chapterContent = await ChapterContentModel.findOne({mangaID});
            chapterContent.chapters.push(chapters);
            const response =  await chapterContent.save();
            res.json(response)
        } catch (error) {
            res.json(error)
        }
    }

});


export {router as chapterContentRouter};