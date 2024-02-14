import express from "express";
import MangaModel from "../models/Manga.js";


const router =  express.Router();

router.post("/", (req, res)=> {
    const manga = new MangaModel(req.body);
    manga.save();
    res.json(req.body)
});

export {router as portfolioRouter};