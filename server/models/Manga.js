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
      type: String,
      required: true
    }]
  }]
});


const ChapterContentModel = mongoose.model("ChapterContent", chapterContentSchema);

export {MangaModel, ChapterContentModel};