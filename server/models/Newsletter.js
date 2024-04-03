import mongoose from "mongoose";


const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});


const NewsletterModel = mongoose.model("newsletter", newsletterSchema );


export default NewsletterModel;