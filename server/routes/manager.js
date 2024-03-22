import express from "express";
import multer from "multer";
import { ChapterContentModel, MangaModel, ImageModel } from "../models/Manga.js";


const password = process.env.MONGO_DB;

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});
const router = express.Router();


router.post("/create/manga", upload.single("coverImage"), async (req, res)=> {
    
    try {
        const mangaDetails = {
            name: req.body.name, 
            coverImage: req.file.originalname,
        };

        const manga = new MangaModel(mangaDetails);
        const mangaResponse =  await manga.save();

        const imageDetails = {
            imageID: mangaResponse._id,
            name: req.file.originalname, 
            imageData: req.file.buffer
        };

        const image = new ImageModel( imageDetails);
        const imageResponse =  await image.save();

        res.json({mangaResponse, imageResponse});
    } catch (error) {
        res.json(error);
    }
});

router.post("/create/manga/chapter", upload.array("pages"), async (req, res)=> {
    const {mangaID, mangaName} = req.body;

    if (mangaID) {
        
        const chapters = {
            chapterNumber: req.body.chapterNumber,
            title: req.body.title,
            pages: req.files.map((file) => ({ name: file.originalname })),
        };
        
        const chapterDetails = {
            mangaID,
            mangaName, 
            chapters 
        }; 
        
        const mangaContent = await ChapterContentModel.findOne({mangaID});

        if (!mangaContent){     
            try {
                const chapterContent = new ChapterContentModel(chapterDetails);
                const chapterResponse =  await chapterContent.save();

                const imageDetails = req.files.map((file, index) => ({
                    imageID: chapterResponse.chapters[0].pages[index]._id,
                    name: file.originalname,
                    imageData: file.buffer,
                }));
            
                const imageResponse = await ImageModel.insertMany( imageDetails);

                res.json({chapterResponse, imageResponse});
            } catch (error) {
                res.json(error);
            }
        } else if (mangaContent) {
            try {
                const chapterContent = await ChapterContentModel.findOne({mangaID});
                chapterContent.chapters.push(chapters);
                const chapterResponse =  await chapterContent.save();

                const imageDetails = req.files.map((file, index) => ({
                    imageID: chapterResponse.chapters[chapterResponse.chapters.length - 1].pages[index]._id,
                    name: file.originalname,
                    imageData: file.buffer,
                }));

                const imageResponse = await ImageModel.insertMany( imageDetails);

                res.json({chapterResponse, imageResponse});
            } catch (error) {
                res.json(error);
            }
        }
    }
});


router.delete("/delete/manga", async (req, res) => {
    const {id, name} = req.body;
    console.log("Deleting manga with ID:", id);
    console.log("Testing:", req.body);

    if (id) {
        const manga = await MangaModel.findOne({_id: id});   
        if (name === manga.name) {
            try {
                const manga = await MangaModel.findOneAndDelete({_id: id});
                console.log("Deleted manga:", manga);
        
                const deletedChapterContent = await ChapterContentModel.findOneAndDelete({mangaID: id});
                console.log("Deleted chapter content:", deletedChapterContent);

                const pageImages = deletedChapterContent.chapters.reduce((acc, chapter) => {
                    acc.push(...chapter.pages.map((page) => page._id));
                    return acc;
                }, []);

                  // Add the manga's imageID to the list of images to delete
                  pageImages.push(manga._id);

                  const images = await ImageModel.deleteMany({ imageID: { $in: pageImages } });
                  console.log("Deleted all manga images:", images.deletedCount);
  
        
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
    }
});

router.delete("/delete/manga/chapter", async (req, res) => {
    const { mangaID, chapterID, title } = req.body;

    if (!mangaID || !chapterID) {
        return res.status(400).json({ message: "Invalid request" });
    }

    if (chapterID) {
        try {
            const manga = await ChapterContentModel.findOne({ mangaID });
            if (!manga) {
                return res.status(404).json({ message: "Manga not found" });
            }

            const foundTitle = manga.chapters.find(chapter => chapter.title === title);
            console.log(foundTitle);
            if (foundTitle) {
                const chapterIndex = manga.chapters.findIndex(chapter => chapter._id.toString() === chapterID);
                if (chapterIndex === -1) {
                    return res.status(404).json({ message: "Chapter not found" });
                }
        
                const chapter = manga.chapters[chapterIndex];
                const imageIDs = chapter.pages.map(page => page._id);
        
                manga.chapters.splice(chapterIndex, 1);
                await manga.save();
        
                // Delete images associated with the chapter
                const images = await ImageModel.deleteMany({ imageID: { $in: imageIDs } });
                console.log("Deleted all manga images:", images.deletedCount);
            }
            res.json({ message: "Chapter deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } 
});


router.put("/edit/manga", upload.single("coverImage"), async (req, res) => { 
    const { mangaID, name } = req.body;
    try {
        if (mangaID) {
            if (req.file && name){
                const manga = await MangaModel.findOneAndUpdate({_id: mangaID}, { name: name, coverImage: req.file.originalname}, { new: true });
                const Chapter = await ChapterContentModel.findOneAndUpdate({mangaID}, { mangaName: name}, { new: true });

                if (!manga) {
                    return res.status(404).json({ message: "Manga not found" });
                }
                res.json({ message: "Manga updated successfully", manga });
            
            }  else if (req.file || name){
                if (req.file) {
                    const manga = await MangaModel.findOneAndUpdate({_id: mangaID}, {coverImage: req.file.originalname}, { new: true });
                    const image = await ImageModel.findOneAndUpdate({imageID: mangaID}, {name: req.file.originalname, imageData: req.file.buffer}, { new: true });
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
        const updateChapterFields = {};

        if (title) {
            updateChapterFields["chapters.$.title"] = title;
        }
        if (chapterNumber) {
            updateChapterFields["chapters.$.chapterNumber"] = chapterNumber;
        }
        if (req.files && req.files.length > 0) {

            const manga = await ChapterContentModel.findOne({ mangaID });
            if (!manga) {
                return res.status(404).json({ message: "Manga not found" });
            }
    
            const chapterIndex = manga.chapters.findIndex(chapter => chapter._id.toString() === chapterID);
            if (chapterIndex === -1) {
                return res.status(404).json({ message: "Chapter not found" });
            }
    
            const chapter = manga.chapters[chapterIndex];
            const imageIDs = chapter.pages.map(page => page._id);
    

            manga.chapters[chapterIndex].pages.splice(0, manga.chapters[chapterIndex].pages.length);
            await manga.save();
            
            // Delete images associated with the chapter
            const images = await ImageModel.deleteMany({ imageID: { $in: imageIDs } });
            console.log("Deleted all manga images:", images.deletedCount);
            
            const pages = req.files.map(file => ({name : file.originalname}));

            manga.chapters[chapterIndex].pages.push(...pages);
            await manga.save();

            const imageDetails = req.files.map((file, index) => ({
                imageID: manga.chapters[chapterIndex].pages[index]._id,
                name: file.originalname,
                imageData: file.buffer,
            }));

            await ImageModel.insertMany( imageDetails);
        }

        try {
            const result = await ChapterContentModel.findOneAndUpdate(
                { mangaID, "chapters._id": chapterID },
                { $set: updateChapterFields },
                { new: true }
            );
    
            if (!result) {
                return res.status(404).json({ message: "Chapter not found" });
            }

            res.json({result});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

export {router as managerRouter};
