import express from "express";
import mongoose from "mongoose";
import {MangaModel, ChapterContentModel} from "../models/Manga.js";


const router =  express.Router();

router.get("/", async (req, res)=> {
    try {
        const response = await MangaModel.find({});
        res.json(response)
    } catch (error) {
        res.json(error)
    }

});

router.post("/", async (req, res)=> {
    const manga = new MangaModel(req.body);
    try {
        const response =  await manga.save();
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

router.post("/chapterContent", async (req, res)=> {
    const chapterContent = new ChapterContentModel(req.body);
    try {
        const response =  await chapterContent.save();
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

export {router as mangaRouter};