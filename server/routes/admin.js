import 'dotenv/config'
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AdminModel from "../models/Admin.js";

const router = express.Router();
const saltRounds = 10;
const secret = process.env.SECRET_KEY;

router.post("/register", async (req, res)=> {
    const {username, password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const userAdmin = await AdminModel.findOne({username});
    const userAdminNumber = await AdminModel.find();

    if(userAdminNumber.length < 3){
        if(!userAdmin){
            const admin = new AdminModel({username, password : hash });
            admin.save();
            res.json({
                message: "User successfully Register",
                color: "green"
            });
        } else if(userAdmin){
            res.json({
                message: "User already exist login",
                color: "red"
            });
        } 
    } else {
        res.json({
            message: "Maximum Number of Admin",
            color: "red"
        });
    }
});

router.post("/login", async (req, res)=> {
    const {username, password} = req.body;
    const userAdmin = await AdminModel.findOne({username});

    if (userAdmin){
        if(bcrypt.compareSync(password, userAdmin.password)) {
           const token = jwt.sign({id : userAdmin._id}, secret);
            res.json({
                token, adminUserID : userAdmin._id, 
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
    if (!userAdmin) {
        res.json({
            message: "User not found",
            color: "red"
        });
    }
});

export {router as adminRouter};



