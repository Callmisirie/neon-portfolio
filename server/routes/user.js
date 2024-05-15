import 'dotenv/config'
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import nodemailer from "nodemailer";
import validator from "email-validator"

import UserModel from "../models/User.js";

const router = express.Router();
const saltRounds = 10;
const secret = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use false for TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Add this line to disable certificate validation
    }
});

router.post("/register", async (req, res)=> {
    const {firstName, lastName, email, password} = req.body;

    // Validate email format
    if (!validator.validate(email)) {
        return res.json({
            message: "Invalid email format",
            color: "red"
        });
    }

    // Check if email already exists
    const user = await UserModel.findOne({email : _.toLower(email)});
    if (!user) {
        const hash = bcrypt.hashSync(password, saltRounds);
        const newUser = new UserModel({firstName, lastName, email : _.toLower(email), password : hash });
        const userResponse = await newUser.save();

        console.log(userResponse);

        const info = transporter.sendMail({
            from: {
               name: "Neon World",
               address:  process.env.EMAIL_USER
            }, // sender address
            to: userResponse.email, // list of receivers
            subject: "User Registration", // Subject line
            html: `<p>You have successfully registered to Neon World.</p>`
         });

        return res.json({
            message: "User successfully Register",
            color: "green"
        });
    } else {
        return res.json({
            message: "User already exists, please login",
            color: "red"
        });
    } 
});

router.post("/login", async (req, res)=> {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email : _.toLower(email)});

    if (user){
        if(bcrypt.compareSync(password, user.password)) {
           const token = jwt.sign({id : user._id}, secret);
            res.json({
                token, userID : user._id, 
                message: "Successfully logged in",
                color: "green"
            });
        } else {
            res.json({
                message: "Incorrect password",
                color: "red"
            });
        }
    } 
    if (!user) {
        res.json({
            message: "User not found",
            color: "red"
        });
    }
});

export {router as userRouter};



