import express from "express";
import TransactionHistoryModel from "../models/TransactionHistory.js";
import UserModel from "../models/User.js";

const router = express.Router();

router.get("/read", async(req, res) => {
    const {userID} = req.query;
    let userTransactionHistory;
    
    try {
        const user = await UserModel.findOne({_id : userID});
        const users = await UserModel.find({});

        const transactionHistory = await TransactionHistoryModel.find({});
        if (userID) {
            const response = await TransactionHistoryModel.findOne({userID: user._id});
            userTransactionHistory = response
        }
        res.json({transactionHistory, userTransactionHistory, users}); 
        
    } catch (error) {
        console.error(error)
        res.json("Error reading transaction");
    }
   
})

router.post("/create", async (req, res) => {    
    let {
        paymentMethod, cryptoName, priceInCrypto,
        artStyle, price, quantity, 
        discount, discountInterval,
        pricePer, userID
    } = req.body;

    let name;
    let cryptoInPrice;

   
    console.log({
        paymentMethod, cryptoName, priceInCrypto,
        artStyle, price, quantity, 
        discount, discountInterval,
        pricePer, userID});

    if (paymentMethod === "Crypto") {
        name = cryptoName
        cryptoInPrice = Number(priceInCrypto)
    }

    const user = await UserModel.findOne({_id : userID});
    const userTransactionHistory = await TransactionHistoryModel.findOne({userID: user._id});

    if(user && user._id) {
        if (paymentMethod && artStyle && price && quantity && discount && discountInterval && pricePer) {

            function formatDate(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}/${month}/${day}`;
            }
            
            const date = new Date();
            const formattedDate = formatDate(date);   

            const transactionDetails = {
                paymentMethod, paymentStatus: "Pending", 
                cryptoName: name, artStyle, 
                price, priceInCrypto: cryptoInPrice, 
                quantity, discount, 
                discountInterval, pricePer,
                date: formattedDate 
            }

            if(!userTransactionHistory) {
                try {
                    const transactionHistory = new TransactionHistoryModel({
                        userID: user._id,
                        transactionDetails: [transactionDetails]
                    });
                    transactionHistory.save(); 

                    res.json({
                        message: "Transaction saved successfully",
                        color: "green"
                    });            
                } catch (error) {
                    console.error(error);
                    res.json({
                        message: "Error saving transaction",
                        color: "red"
                    });
                }
            } else if (userTransactionHistory) {
                try {
                    const userTransactionHistory = await TransactionHistoryModel.findOne({userID: user._id});
                    userTransactionHistory.transactionDetails.push(transactionDetails);
                    await userTransactionHistory.save(); 

                    res.json({
                        message: "Transaction saved successfully",
                        color: "green"
                    });
                } catch (error) {
                    console.error(error);
                    res.json({
                        message: "Error saving transaction",
                        color: "red"
                    });
                }    
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

router.put("/status", async (req, res)=> {
    const {userID, transactionHistoryID, transactionDetailID, checkboxValue} = req.body;
    const user = await UserModel.findOne({_id : userID}); 

    if(user) {
        const userTransactionHistory = await TransactionHistoryModel.findOne({userID});
        console.log({userTransactionHistory: userTransactionHistory});

        if (transactionHistoryID === transactionDetailID && userTransactionHistory && userID && transactionHistoryID && transactionDetailID && checkboxValue) {     
            try {
                const transactionDetailIndex = userTransactionHistory.transactionDetails.findIndex(transactionDetail => transactionDetail._id.toString() === transactionDetailID);

                console.log({transactionDetailIndex: transactionDetailIndex});

                userTransactionHistory.transactionDetails[transactionDetailIndex].paymentStatus = checkboxValue;

                await userTransactionHistory.save()

                res.json({
                    message: "Transaction status updated successfully",
                    color: "green"
                });            
            } catch (error) {
                console.error(error);
                res.json({
                    message: "Failed to update Transaction Stautus, Internal server error",
                    color: "red"
                });
            }
        } else {
            res.json({
                message: "Failed to update Transaction Stautus",
                color: "red"
            });
        }        
    } else {
        res.json({
            message: "Transaction User does not exist",
            color: "red"
        });
    }
});

router.delete("/delete", async (req, res) =>{
    const {userID, transactionHistoryID, transactionDetailID} = req.body;
    const user = await UserModel.findOne({_id : userID}); 

    console.log({userID, transactionHistoryID, transactionDetailID});

    if(user) {
        const userTransactionHistory = await TransactionHistoryModel.findOne({userID});
        console.log({userTransactionHistory: userTransactionHistory});

        if ( transactionHistoryID === transactionDetailID && userTransactionHistory && userID && transactionHistoryID && transactionDetailID) {     
            try {
                const transactionDetailIndex = userTransactionHistory.transactionDetails.findIndex(transactionDetail => transactionDetail._id.toString() === transactionDetailID);


                console.log({transactionDetailIndex: transactionDetailIndex});

                userTransactionHistory.transactionDetails.splice(transactionDetailIndex, 1);
                await userTransactionHistory.save()

                res.json({
                    message: "Transaction deleted successfully",
                    color: "green"
                });            
            } catch (error) {
                console.error(error);
                res.json({
                    message: "Failed to delete Transaction, Internal server error",
                    color: "red"
                });
            }
        } else {
            res.json({
                message: "Failed to delete Transaction",
                color: "red"
            });
        }        
    } else {
        res.json({
            message: "Transaction User does not exist",
            color: "red"
        });
    }

});

export {router as transactionHistoryRouter};