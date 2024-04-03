import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    coverImage: {
        type: String,
        required: true
    },
    // about: {
    //     type: String,
    //     required: true
    // }
});

const MangaModel = mongoose.model("Manga", mangaSchema);



const chapterContentSchema = new mongoose.Schema({
  mangaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mangas",
    required: true,
  },
  mangaName: {
    type: mongoose.Schema.Types.String,
    ref: "mangas",
    required: true,
  },
  chapters: [{
    chapterNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    pages: [{  
      name:{ 
      type: String,
      required: true}
    }]
  }]
});


const ChapterContentModel = mongoose.model("ChapterContent", chapterContentSchema);


const imageSchema = new mongoose.Schema({
  imageID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
      type: String,
      required: true
  },
  imageData: {
    type: Buffer,
    required: true
  },
});

const ImageModel = mongoose.model("Image", imageSchema);

export {MangaModel, ChapterContentModel, ImageModel}; 