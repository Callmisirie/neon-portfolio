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
    }
});


export {router as mangaRouter};