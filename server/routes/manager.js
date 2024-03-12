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
const router = express.Router();


router.post("/create/manga", upload.single("coverImage"), async (req, res)=> {
    try {
        const result = {
            name: req.body.name, 
            coverImage: req.file.path
        };
        const manga = new MangaModel(result);
        const response =  await manga.save();
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

router.post("/create/manga/chapter", upload.array("pages"), async (req, res)=> {

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
            res.json(response);
        } catch (error) {
            res.json(error);
        }
    } else if (mangaContent) {
        try {
            const chapterContent = await ChapterContentModel.findOne({mangaID});
            chapterContent.chapters.push(chapters);
            const response =  await chapterContent.save();
            res.json(response)
        } catch (error) {
            res.json(error);
        }
    }

});


router.delete("/delete/manga", async (req, res) => {
    const {id, name} = req.body;
    console.log("Deleting manga with ID:", id);
    console.log("Testing:", req.body);

    const manga = await MangaModel.findOne({_id: id});

    if (name === manga.name) {
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
    }

});

router.delete("/delete/manga/chapter", async (req, res) => {
    const { mangaID, chapterID, title } = req.body;

    if (!mangaID || !chapterID) {
        return res.status(400).json({ message: "Invalid request" });
    }

    try {
        const manga = await ChapterContentModel.findOne({ mangaID });
        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        const foundTitle = manga.chapters.find(chapter => chapter.title === title);
        console.log(foundTitle);
        if (foundTitle) {
            manga.chapters = manga.chapters.filter(chapter => chapter._id.toString() !== chapterID);
            await manga.save();
        }

        res.json({ message: "Chapter deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/edit/manga", upload.single("coverImage"), async (req, res) => { 
    const { mangaID, name } = req.body;
    try {
        if (mangaID) {
            if (req.file && name){
                const manga = await MangaModel.findOneAndUpdate({_id: mangaID}, { name: name, coverImage: req.file.path}, { new: true });
                const Chapter = await ChapterContentModel.findOneAndUpdate({mangaID}, { mangaName: name}, { new: true });

                if (!manga) {
                    return res.status(404).json({ message: "Manga not found" });
                }
                res.json({ message: "Manga updated successfully", manga });
            
            }  else if (req.file || name){
                if (req.file) {
                    const manga = await MangaModel.findOneAndUpdate({_id: mangaID}, {coverImage: req.file.path}, { new: true });
                } else if (name) {
                    const manga = await MangaModel.findOneAndUpdate({_id: mangaID}, { name: name}, { new: true });
                    const Chapter = await ChapterContentModel.findOneAndUpdate({mangaID}, { mangaName: name}, { new: true });

                    if (!manga) {
                        return res.status(404).json({ message: "Manga not found" });
                    }
                    res.json({ message: "Manga updated successfully", manga });
                }
             }
        }
       
    } catch (error) {
        console.error("Error updating manga:", error);
        res.status(500).json({ message: "Failed to update manga" });
    }
});

router.put("/edit/manga/chapter", upload.array('pages'), async (req, res) => {
    const { mangaID, chapterID, title, chapterNumber } = req.body;
 
    if (mangaID && chapterID) {
        const updateFields = {};
        if (title) {
            updateFields["chapters.$.title"] = title;
        }
        if (chapterNumber) {
            updateFields["chapters.$.chapterNumber"] = chapterNumber;
        }
        if (req.files && req.files.length > 0) {
            const pages = req.files.map(file => file.path);
            updateFields["chapters.$.pages"] = pages;
        }

        try {
            const result = await ChapterContentModel.findOneAndUpdate(
                { mangaID, "chapters._id": chapterID },
                { $set: updateFields },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({ message: "Chapter not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

export {router as managerRouter};
