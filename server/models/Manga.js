import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    coverImage: {
        type: String,
        required: true
      },
    chapters: [{
        chapterNumber: {
            type: Number,
            required: true
          },
        title: {
            type: String,
            required: true
          },
        pages: [{
        type: String,
        required: true
      }]
    }],
    // about: {
    //     type: String,
    //     required: true
    // }
});

const MangaModel = mongoose.model("Manga", mangaSchema);

export default MangaModel;