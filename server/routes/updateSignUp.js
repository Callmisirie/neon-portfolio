import express from "express";
import bcrypt from "bcrypt";
import UpdateSignUpModel from "../models/UpdateSignUp.js";

const router = express.Router();
const saltRounds = 10;


router.post("/", async (req, res) => {
    const email = req.body.email;
    const signUps = await UpdateSignUpModel.find({})
    try {
        const updateSignUp = new UpdateSignUpModel({email});
        updateSignUp.save();
        res.json({message: "Submitted Successfully"})
    } catch (error) {
        console.error(error);
    }
});


export {router as updateSignUpRouter}