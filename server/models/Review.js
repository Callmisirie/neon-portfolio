import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

const ReviewModel = mongoose.model("Review", reviewSchema);

export {ReviewModel};