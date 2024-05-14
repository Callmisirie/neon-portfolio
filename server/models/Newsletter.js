import mongoose from "mongoose";


const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});


const NewsletterModel = mongoose.model("newsletter", newsletterSchema );


const newsletterUpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});


const NewsletterUpdateModel = mongoose.model("newsletterUpdate", newsletterUpdateSchema );

export default NewsletterModel;

export {NewsletterUpdateModel};