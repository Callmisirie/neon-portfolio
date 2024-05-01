import 'dotenv/config'
import express from "express";
import { OTPModel } from "../models/OTP.js";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import _ from "lodash"

const router = express.Router();
const saltRounds = 10;

router.post("/generateOTP", async (req, res)=> {
   const {id} = req.body;
   const user = await UserModel.findOne({email: _.toLower(id)})

   if (user) {
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (userOTP) {
            await OTPModel.deleteOne({id : _.toLower(id)});
            const randomOTP = Math.floor(1000 + (3000 * Math.random()));
            const OTP = new OTPModel({id : _.toLower(id), OTP: randomOTP});

            const response = await OTP.save();
            res.json({
               message: "Password reset OTP generated",
               color: "green"
            });   

         } else if (!userOTP) {
            const randomOTP = Math.floor(1000 + (3000 * Math.random()))
            const OTP = new OTPModel({id: _.toLower(id), OTP: randomOTP})

            const response = await OTP.save();
            res.json({
               message: "Password reset OTP generated",
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

router.post("/comfirmOTP", async (req, res)=> {
   const {id, OTP} = req.body;
   const user = await UserModel.findOne({email: _.toLower(id)})

   if (user) {  
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (OTP === userOTP.OTP) {
            res.json({
               message: "Correct OTP",
               color: "green"
            });   
         } else {
            res.json({
               message: "Incorrect OTP",
               color: "red"
            });
         }  
      } catch (error) {
         console.error(error);
         res.json({
            message: "Internal error checking OTP ",
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

router.post("/passwordChange", async (req, res)=> {
   const {id, OTP, newPassword} = req.body;
   const user = await UserModel.findOne({email: _.toLower(id)})

   if (user) {  
      try {
         const userOTP = await OTPModel.findOne({id: user.email})
         if (newPassword) {
            if (OTP === userOTP.OTP) {
               const hash = bcrypt.hashSync(newPassword, saltRounds);
               await UserModel.findOneAndUpdate({email: user.email}, {password: hash}, {new: true})
               res.json({
                  message: "Successfully changed password",
                  color: "green"
               });   
            } else {
               res.json({
                  message: "Failed to change password",
                  color: "red"
               });
            }            
         } else {
            res.json({
               message: "Password field empty",
               color: "red"
            });
         }
      } catch (error) {
         console.error(error);
         res.json({
            message: "Internal error changing password ",
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

export {router as passwordResetRouter};