import mongoose from "mongoose";


const transactionHistorySchema = new mongoose.Schema({
    paymentMethod: {
        type: String,
        required: true,
    },
    artStyle: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discountInterval: {
        type: Number,
        required: true,
    },
    pricePer: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
});



const TransactionHistoryModel = mongoose.model("transactionHistory", transactionHistorySchema );


export default TransactionHistoryModel;