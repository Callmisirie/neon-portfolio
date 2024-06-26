import 'dotenv/config'
import express from "express";
import { OTPModel } from "../models/OTP.js";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import _ from "lodash"
import nodemailer from "nodemailer";

const router = express.Router();
const saltRounds = 10;

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


router.post("/generateOTP", async (req, res)=> {
   const {id} = req.body;
   const user = await UserModel.findOne({email: _.toLower(id)})
   
   if (user) {
      console.log(user.email);
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (userOTP) {
            await OTPModel.deleteOne({id : _.toLower(id)});
            const randomOTP = Math.floor(1000 + (3000 * Math.random()));
            const OTP = new OTPModel({id : _.toLower(id), OTP: randomOTP});

            const response = await OTP.save();

            const info = transporter.sendMail({
               from: {
                  name: "CallmiNeon",
                  address:  process.env.EMAIL_USER
               }, // sender address
               to: user.email, // list of receivers
               subject: "Password Reset", // Subject line
               html: `<p>Your OTP is: ${randomOTP}</p>`
            });

            res.json({
               message: "Check your email for code",
               color: "green"
            }); 

         } else if (!userOTP) {
            const randomOTP = Math.floor(1000 + (3000 * Math.random()))
            const OTP = new OTPModel({id: _.toLower(id), OTP: randomOTP})

            const response = await OTP.save();
            res.json({
               message: "Check your email for code",
               color: "green"
            }); 
         }           
      } catch (error) {
         console.error(error);
         res.json({
            message: "Internal error generating OTP",
            color: "red"
         });
      } 
   } else if (!user) {
      res.json({
         message: "User does not exist",
         color: "red"
      });
   }
});

router.post("/confirmOTP", async (req, res)=> {
   const {id, code} = req.body;
   const OTP = code;

   console.log({id, code});
   const user = await UserModel.findOne({email: _.toLower(id)})

   if (user) {  
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (Number(OTP) === userOTP.OTP) {
            res.json({
               isMatch: true,
               message: "Correct OTP",
               color: "green"
            });   
         } else {
            res.json({
               isMatch: false,
               message: "Incorrect OTP",
               color: "red"
            });
         }  
      } catch (error) {
         console.error(error);
         res.json({
            isMatch: false,
            message: "Internal error checking OTP ",
            color: "red"
         });
      } 
   } else if (!user) {
      res.json({
         isMatch: false,
         message: "User does not exist",
         color: "red"
      });
   }
});

router.post("/changePassword", async (req, res)=> {
   console.log(req.body);
   const {id, code, newPassword} = req.body;
   const OTP = code;
   const user = await UserModel.findOne({email: _.toLower(id)})

   if (user) {  
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (newPassword) {
            if (Number(OTP) === userOTP.OTP) {
               const hash = bcrypt.hashSync(newPassword, saltRounds);
               await UserModel.findOneAndUpdate({email: user.email}, {password: hash}, {new: true})

               const info = transporter.sendMail({
                  from: {
                     name: "CallmiNeon",
                     address:  process.env.EMAIL_USER
                  }, // sender address
                  to: user.email, // list of receivers
                  subject: "Password Change", // Subject line
                  html: `<p>Your password was successfully changed.</p>`
                  
               });

               res.json({
                  isMatch: true,
                  message: "Successfully changed password",
                  color: "green"
               });   
            } else {
               res.json({
                  isMatch: false,
                  message: "Failed to change password",
                  color: "red"
               });
            }            
         } else {
            res.json({
               isMatch: false,
               message: "Password field empty",
               color: "red"
            });
         }
      } catch (error) {
         console.error(error);
         res.json({
            isMatch: false,
            message: "Internal error changing password ",
            color: "red"
         });
      } 
   } else if (!user) {
      res.json({
         isMatch: false,
         message: "User does not exist",
         color: "red"
      });
   }
});

export {router as passwordResetRouter};