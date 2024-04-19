import 'dotenv/config'
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

const router = express.Router();
const saltRounds = 10;
const secret = process.env.SECRET_KEY;

router.post("/register", async (req, res)=> {
    const {firstName, lastName, email, password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const user = await UserModel.findOne({email});

    if(!user){
        const user = new UserModel({firstName, lastName, email, password : hash });
        user.save();
        res.json({
            message: "User successfully Register",
            color: "green"
        });
    } else if(user){
        res.json({
            message: "User already exist login",
            color: "red"
        });
    } 
    
});

router.post("/login", async (req, res)=> {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});

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



