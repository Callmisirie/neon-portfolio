import express from "express";
import TransactionHistoryModel from "../models/TransactionHistory.js";
import UserModel from "../models/User.js";

const router = express.Router();

router.get("/read", async(req, res) => {
    const {userID} = req.query;
    if (userID) {
        try {
            const user = await UserModel.findOne({_id : userID});
            const transactionHistory = await TransactionHistoryModel.find({userID: user._id});
            res.json(transactionHistory); 
            
        } catch (error) {
            console.error(error)
            res.json("Error saving transaction");
        }
    }
})

router.post("/create", async (req, res) => {
    const {
        paymentMethod, artStyle,
        price, quantity, 
        discount, discountInterval,
        pricePer, userID
    } = req.body;

    console.log({
        paymentMethod, artStyle,
        price, quantity, 
        discount, discountInterval,
        pricePer, userID
    });

    const user = await UserModel.findOne({_id : userID});

    if(user && user._id) {
        if (paymentMethod && artStyle && price && quantity && discount && discountInterval && pricePer) {
                try {
                    function formatDate(date) {
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        return `${year}/${month}/${day}`;
                    }
                    
                    const date = new Date();
                    const formattedDate = formatDate(date);            
        
                
                    const transactionHistory = new TransactionHistoryModel({
                        paymentMethod, artStyle, 
                        price, quantity, 
                        discount, discountInterval, 
                        pricePer, userID: user._id,
                        date: formattedDate
                    })

                    transactionHistory.save(); 

                    res.json({
                        message: "Transaction saved successfully",
                        color: "green"
                    });            
                } catch (error) {
                    console.error(error)
                    res.json({
                        message: "Error saving transaction",
                        color: "red"
                    });
                }
            } else {
                res.json({
                    message: "Missing fields",
                    color: "red"
                });    
            }        
    } else {
        res.json({
            message: "User not logged in",
            color: "red"
        });    
    }        
  
});


export {router as transactionHistoryRouter};