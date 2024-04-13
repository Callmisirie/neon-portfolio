import express from "express";
import multer from "multer";
import { ChapterContentModel, MangaModel, ImageModel } from "../../models/Manga.js";


const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});
const router = express.Router();


router.post("/create/manga", upload.single("coverImage"), async (req, res)=> {
    
    try {
        const mangaDetails = {
            name: req.body.name, 
            about: req.body.about, 
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

        res.json({
            message: "Manga uploaded successfully",
            color: "green"
        });
    } catch (error) {
        console.error(error)
        res.json({
            message: "Error uploading manga",
            color: "red"
        });
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
                res.json({
                    message: "Chapter uploaded successfully",
                    color: "green"
                });
            } catch (error) {
                console.error(error)
                res.json({
                    message: "Error uploading chapter",
                    color: "red"
                })
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

                res.json({
                    message: "Chapter uploaded successfully",
                    color: "green"
                });
            } catch (error) {
                console.error(error)
                res.json({
                    message: "Error uploading chapter",
                    color: "red"
                })
            }
        }
    } else {
        res.json({
            message: "Error uploading chapter, manga not selected",
            color: "red"
        });
    }
});


router.delete("/delete/manga", async (req, res) => {
    const {id, name} = req.body;
    console.log("Deleting manga with ID:", id);
    console.log("Testing:", req.body);

    if (id) {
        const manga = await MangaModel.findOne({_id: id});   
        if (manga && name === manga.name) {
            
                const manga = await MangaModel.findOneAndDelete({_id: id});
                const images = await ImageModel.deleteOne({ imageID: manga._id })
                console.log("Deleted images:", images.deletedCount);
                console.log("Deleted manga:", manga);
                const chapterContent = await ChapterContentModel.findOne({mangaID: id});

            if (chapterContent) {
                try {
                    const deletedChapterContent = await ChapterContentModel.findOneAndDelete({mangaID: id});
                    console.log("Deleted chapter content:", deletedChapterContent);
    
                    const pageImages = deletedChapterContent.chapters.reduce((acc, chapter) => {
                        acc.push(...chapter.pages.map((page) => page._id));
                        return acc;
                    }, []);
    
                    const images = await ImageModel.deleteMany({ imageID: { $in: pageImages } });
                    console.log("Deleted all manga images:", images.deletedCount);
                } catch (error) {
                    console.error("Error deleting manga:", error);
                }
            } 
            if (manga || chapterContent) {
                res.json({
                    message: "Manga deleted",
                    color: "green"
                });
            } else {
                res.json({
                    message: "Manga not found",
                    color: "red"
                });
            }
        } else {
            res.json({
                message: "Failed to delete manga, manga name does not match",
                color: "red"
            });
        }
    }  else {
        res.json({
            message: "Failed to delete manga, manga not selected",
            color: "red"
        });
    }
});

router.delete("/delete/manga/chapter", async (req, res) => {
    const { mangaID, chapterID, title } = req.body;

    if (chapterID) {
        try {
            const manga = await ChapterContentModel.findOne({ mangaID });
            if (!manga) {
                res.json({
                    message: "Manga not found",
                    color: "red"
                });
            }

            const foundTitle = manga.chapters.find(chapter => chapter.title === title);
            console.log(foundTitle);
            if (foundTitle) {
                const chapterIndex = manga.chapters.findIndex(chapter => chapter._id.toString() === chapterID);
                if (chapterIndex === -1) {
                    res.json({
                        message: "Chapter not found",
                        color: "red"
                    });
                }
        
                const chapter = manga.chapters[chapterIndex];
                const imageIDs = chapter.pages.map(page => page._id);
        
                manga.chapters.splice(chapterIndex, 1);
                await manga.save();
        
                // Delete images associated with the chapter
                const images = await ImageModel.deleteMany({ imageID: { $in: imageIDs } });
                console.log("Deleted all manga images:", images.deletedCount);

                res.json({ 
                    message: "Chapter deleted", 
                    color: "green"
                });
            } else {
                res.json({ 
                    message: "Failed to delete chapter, chapter name does not match", 
                    color: "red"
                });
            }
           
        } catch (error) {
            console.error(error);
            res.json({ 
                message: "Internal server error", 
                color: "red"
            });
        }
    }  else if (!mangaID || !chapterID) {
        res.json({
            message: "Failed to delete chapter",
            color: "red"
        });
    }
});


router.put("/edit/manga", upload.single("coverImage"), async (req, res) => { 
    const { mangaID, name, about } = req.body;

    if (mangaID) {
        const manga = await MangaModel.findOne({_id: mangaID});
        let message = {};
        try {            
            if (req.file || name || about){
                if (req.file) {
                    await MangaModel.findOneAndUpdate({_id: mangaID}, {coverImage: req.file.originalname}, { new: true });
                    await ImageModel.findOneAndUpdate({imageID: mangaID}, {name: req.file.originalname, imageData: req.file.buffer}, { new: true });
                    message = {
                        message: "Manga updated successfully",
                        color: "green"
                    }
                }   
                if (name) {
                        await MangaModel.findOneAndUpdate({_id: mangaID}, {name}, { new: true });
                        const chapterContent = await ChapterContentModel.findOne({mangaID});

                        if (chapterContent) {
                            await ChapterContentModel.findOneAndUpdate({mangaID}, { mangaName: name}, { new: true });
                        }
                        message = {
                            message: "Manga updated successfully",
                            color: "green"
                        }
                }    
                if (about) {
                    await MangaModel.findOneAndUpdate({_id: mangaID}, {about}, { new: true });
                    
                    message = {
                        message: "Manga updated successfully",
                        color: "green"
                    }
            }                 
                res.json(message);
            } else if (!req.file && !name) {
                res.json({
                    message: "Failed to edit manga, missing fields",
                    color: "red"
                });
            }
        } catch (error) {
            console.error("Error updating manga:", error);
            res.json({
                message: "Failed to update manga",
                color: "red"
            });
        }
    } else {
        res.json({
            message: "Failed to edit manga, manga not selected",
            color: "red"
        });
    }
});

router.put("/edit/manga/chapter", upload.array('pages'), async (req, res) => {
    const { mangaID, chapterID, title, chapterNumber } = req.body;
 
    if (mangaID && chapterID) {
        let message = {};
        try {
            const updateChapterFields = {};

            if (title) {
                updateChapterFields["chapters.$.title"] = title;
            }   if (chapterNumber) {
                updateChapterFields["chapters.$.chapterNumber"] = chapterNumber;
            }   if (req.files && req.files.length > 0) {

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

                const newImage = await ImageModel.insertMany( imageDetails);
            }

            await ChapterContentModel.findOneAndUpdate(
                { mangaID, "chapters._id": chapterID },
                { $set: updateChapterFields },
                { new: true }
            );
            
            message = {
                message: "Manga updated successfully",
                color: "green"
            }

            if (!title && !chapterNumber && !req.files.length > 0) {
                message = {
                    message: "Failed to edit manga, missing fields",
                    color: "red"
                }
            }
                
            res.json(message);
        } catch (error) {
            console.error(error);
            res.json({
                message: "Failed to update manga, Internal server error",
                color: "red"
            });
        }
    } else {
        res.json({
            message: "Failed to edit chapter, manga or chapter not selected",
            color: "red"
        });
    }
});

export {router as managerMangaRouter};
