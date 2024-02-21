import express from "express";
import multer from "multer";
import { ChapterContentModel, MangaModel } from "../models/Manga.js";


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
        const response = await MangaModel.find({});
        res.json(response)
    } catch (error) {
        res.json(error)
    }

});

router.post("/", upload.single("coverImage"), async (req, res)=> {
    try {
        const result = {
            name: req.body.name, 
            coverImage: req.file.path
        };
        console.log(result);
        const manga = new MangaModel(result);
        const response =  await manga.save();
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

router.get("/:mangaID", async (req, res)=> {
        const { mangaID } = req.params;
    if (mangaID) {
        const manga = await ChapterContentModel.findOne({mangaID})
        res.json(manga);
        console.log(manga);
    }
});

router.get("/:mangaID/:chapterID", async (req, res) => {
    const { mangaID, chapterID } = req.params;
    if (mangaID && chapterID) {
        try {
            const manga = await ChapterContentModel.findOne({ mangaID });
            if (!manga) {
                return res.status(404).json({ message: "Manga not found" });
            }
            const chapter = manga.chapters.find(ch => ch._id.toString() === chapterID);
            if (!chapter) {
                return res.status(404).json({ message: "Chapter not found" });
            }
            res.json(chapter);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

export {router as mangaRouter};