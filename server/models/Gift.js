import mongoose from "mongoose";

const paypalGiftSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    }, 
    username: {
        type: String,
        required: true
    }
});

const PaypalGiftModel = mongoose.model("PaypalGift", paypalGiftSchema);


const cryptoGiftSchema = new mongoose.Schema({
    cryptoName: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    }, 
    network: {
        type: String,
        required: true
    },
    qrCodeImage: {
        type: String,
        required: true
    }
});

const CryptoGiftModel = mongoose.model("CryptoGift", cryptoGiftSchema);

export {PaypalGiftModel, CryptoGiftModel};