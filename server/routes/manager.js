import express from "express";
import { ChapterContentModel, MangaModel } from "../models/Manga.js";

const router = express.Router();

router.delete("/delete/manga", async (req, res) => {
    const id = req.body.id;
    console.log("Deleting manga with ID:", id);
    console.log("Testing:", req.body);

    try {
        const manga = await MangaModel.findOneAndDelete({_id: id});
        console.log("Deleted manga:", manga);

        const deletedChapterContent = await ChapterContentModel.findOneAndDelete({mangaID: id});
        console.log("Deleted chapter content:", deletedChapterContent);

        if (manga || deletedChapterContent) {
            res.json({message: "Manga deleted"});
        } else {
            res.status(404).json({message: "Manga not found"});
        }
    } catch (error) {
        console.error("Error deleting manga:", error);
        res.status(500).json({message: "Failed to delete manga"});
    }
});

router.delete("/delete/manga/chapter", async (req, res) => {
    const { mangaID, chapterID } = req.body;

    if (!mangaID || !chapterID) {
        return res.status(400).json({ message: "Invalid request" });
    }

    try {
        const manga = await ChapterContentModel.findOne({ mangaID });
        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        manga.chapters = manga.chapters.filter(chapter => chapter._id.toString() !== chapterID);
        await manga.save();

        res.json({ message: "Chapter deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export {router as managerRouter};
