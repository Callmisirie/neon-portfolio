import 'dotenv/config'
import express from "express";
import TransactionHistoryModel from "../models/TransactionHistory.js";
import UserModel from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

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


router.get("/read", async(req, res) => {
    const {userID} = req.query;
    let userTransactionHistory;
    
    try {
        const user = await UserModel.findOne({_id : userID});
        const users = await UserModel.find({});

        const transactionHistory = await TransactionHistoryModel.find({});
        if (userID && user) {
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
        bankCurrency, priceInCurrency,
        artStyle, price, quantity, 
        discount, discountInterval,
        pricePer, userID
    } = req.body;

    let name;
    let cryptoInPrice;
    let subCurrency;
    let subCurrencyPrice;

   
    console.log({
        paymentMethod, cryptoName, priceInCrypto, 
        bankCurrency, priceInCurrency,
        artStyle, price, quantity, 
        discount, discountInterval,
        pricePer, userID});

    if (paymentMethod === "Crypto") {
        name = cryptoName
        cryptoInPrice = Number(priceInCrypto)
    } else if (paymentMethod === "Bank Transfer" && bankCurrency === "NGN" ) {
        subCurrency = bankCurrency
        subCurrencyPrice = Number(priceInCurrency)
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
                cryptoName: name, artStyle, bankCurrency: subCurrency,
                price, priceInCrypto: cryptoInPrice, priceInSubCurrency: subCurrencyPrice, 
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
                    await transactionHistory.save(); 

                    res.json({
                        message: "Order saved successfully",
                        color: "green",
                        orderResponse: transactionDetails,
                        isTrue : true
                    }); 
                    
                    const info = transporter.sendMail({
                        from: {
                           name: "CallmiNeon",
                           address:  process.env.EMAIL_USER
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: "Commission Order", // Subject line
                        html: `<p>Congratulation on making this order, payment confirmation is processing.</p>`
                    });

                    
                    transporter.sendMail({
                        from: {
                        name: "CallmiNeon",
                        address:  process.env.EMAIL_USER
                        }, // sender address
                        to: process.env.EMAIL_USER, // list of receivers
                        subject: "New Order", // Subject line
                        html: `<p>An order was was placed by UserID - ${user._id}</p>` 
                    });

                } catch (error) {
                    console.error(error);
                    res.json({
                        message: "Error saving order",
                        color: "red",
                        isTrue : false
                    });
                }
            } else if (userTransactionHistory) {
                try {
                    const userTransactionHistory = await TransactionHistoryModel.findOne({userID: user._id});
                    userTransactionHistory.transactionDetails.push(transactionDetails);
                    await userTransactionHistory.save(); 

                    res.json({
                        message: "Order saved successfully",
                        color: "green",
                        orderResponse: transactionDetails,
                        isTrue : true
                    });

                    const info = transporter.sendMail({
                        from: {
                           name: "CallmiNeon",
                           address:  process.env.EMAIL_USER
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: "Commission Order", // Subject line
                        html: `<p>Congratulation on making this order, payment confirmation is processing.</p>`
                    });

                    transporter.sendMail({
                        from: {
                        name: "CallmiNeon",
                        address:  process.env.EMAIL_USER
                        }, // sender address
                        to: process.env.EMAIL_USER, // list of receivers
                        subject: "New Order", // Subject line
                        html: `<p>An order was was placed by UserID - ${user._id}</p>` 
                    });

                } catch (error) {
                    console.error(error);
                    res.json({
                        message: "Error saving order",
                        color: "red",
                        isTrue : false
                    });
                }    
            }


             

        } else {
            res.json({
                message: "Missing fields",
                color: "red",
                isTrue : false
            });    
        }        
    } else {
        res.json({
            message: "User not logged in",
            color: "red",
            isTrue : false
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

                await userTransactionHistory.save();

                const info = transporter.sendMail({
                    from: {
                       name: "CallmiNeon",
                       address:  process.env.EMAIL_USER
                    }, // sender address
                    to: user.email, // list of receivers
                    subject: "Order Payment", // Subject line
                    html: `<p>Your order status is -  ${checkboxValue}</p>`
                    
                 });

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