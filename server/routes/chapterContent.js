import express from "express";
import {ChapterContentModel} from "../models/Manga.js";


const router =  express.Router();

router.get("/", async (req, res)=> {
    try {
        const response = await ChapterContentModel.find({});
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

export {router as chapterContentRouter};