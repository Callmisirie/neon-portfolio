import express from "express";
import nodemailer from "nodemailer";
import NewsletterModel from "../models/Newsletter.js";
import { NewsletterUpdateModel } from "../models/Newsletter.js";

const router = express.Router();
const secret = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // your Hostinger email address
        pass: process.env.EMAIL_PASS  // your Hostinger email password
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});


router.post("/", async (req, res) => {
    const email = req.body.email;
    if (email) {
        try {
            const newsletter = new NewsletterModel({email});
            newsletter.save();
            res.json({message: "Submitted Successfully"})
        } catch (error) {
            console.error(error);
        }  
    }  
});

router.post("/update", async (req, res) => {
    const {title,  message} = req.body;

    console.log({title, message});

    let newsletterSignups = await NewsletterModel.find({})
    newsletterSignups = newsletterSignups.map((newsletterSignup) => newsletterSignup.email)

    console.log(newsletterSignups);

        if (title && message) {
            try {
                const info = transporter.sendMail({
                    from: {
                       name: "CallmiNeon",
                       address:  process.env.EMAIL_USER
                    }, // sender address
                    to: newsletterSignups, // list of receivers
                    subject: "Newsletter Update", // Subject line
                    html: `<h2>${title}</h2> 
                    <p>${message}</p>`
                 });
                const updateDetails = {title, message};
                const update = new NewsletterUpdateModel(updateDetails);
                const updateResponse = await update.save();
        
                res.json({
                    message: "Newsletter update uploaded successfully",
                    color: "green"
                }); 
            } catch (error) {
                console.error(error)
                res.json({
                    message: "Error uploading Newsletter update", 
                    color: "red"
                });
            }
        } else {
            res.json({
                message: "Failed to upload newsletter update, missing fields", 
                color: "red"
            });
        }   
});

export {router as newsletterRouter};