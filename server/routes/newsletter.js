import express from "express";
import bcrypt from "bcrypt";
import NewsletterModel from "../models/Newsletter.js";

const router = express.Router();
const saltRounds = 10;


router.post("/", async (req, res) => {
    const email = req.body.email;
    const newsletters = await NewsletterModel.find({})
    try {
        const newsletter = new NewsletterModel({email});
        newsletter.save();
        res.json({message: "Submitted Successfully"})
    } catch (error) {
        console.error(error);
    }
});


export {router as newsletterRouter};