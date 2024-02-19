import express from "express";
import multer from "multer";
import {MangaModel, ChapterContentModel} from "../models/Manga.js";


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

router.get("/chapterContent", async (req, res)=> {
    try {
        const response = await ChapterContentModel.find({});
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

router.post("/chapterContent", upload.array("pages"), async (req, res)=> {

    const result = {
        mangaID: req.body.mangaID,
        mangaName: req.body.mangaName,
        chapters: {
            chapterNumber: req.body.chapterNumber,
            title: req.body.title,
            pages: req.files.map((file)=>
                file.filename
            )
                
        }
    };

    console.log(result);
    
    try {
        const chapterContent = new ChapterContentModel(result);
        const response =  await chapterContent.save();
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

router.put("/chapterContent", async (req, res)=> {
    const {mangaID, chapters} = req.body;
    // console.log(req.body);

    try {
        const chapterContent = await ChapterContentModel.findOne({mangaID});
        console.log(chapterContent);
        chapterContent.chapters.push(chapters);
        const response =  await chapterContent.save();
        res.json(response)
    } catch (error) {
        res.json(error)
    }
});

export {router as mangaRouter};