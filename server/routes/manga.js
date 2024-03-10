import express from "express";
import { ChapterContentModel, MangaModel } from "../models/Manga.js";



const router =  express.Router();

router.get("/", async (req, res)=> {
    try {
        const response = await MangaModel.find({});
        res.json(response);
    } catch (error) {
        res.json(error)
    }

});

router.get("/:mangaID", async (req, res)=> {
        const { mangaID } = req.params;
    if (mangaID) {
        const mangaContent = await ChapterContentModel.findOne({mangaID})
        const manga = await MangaModel.findOne({_id: mangaID})

        res.json({mangaContent, manga});
    }
});

router.get("/find/:mangaName", async (req, res)=> {
    const {mangaName} = req.params;
if (mangaName) {
    const mangas = await MangaModel.find({})
    const filteredMangas = mangas.filter(manga => manga.name.toLowerCase().includes(mangaName.toLowerCase()));
    res.json(filteredMangas);
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
            res.json({chapter, manga});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

export {router as mangaRouter};