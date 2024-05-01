import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    id: {
        type:  String,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    }
});

const OTPModel = mongoose.model("OTP", OTPSchema);

export {OTPModel};