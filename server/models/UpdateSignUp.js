import mongoose from "mongoose";


const UpdateSignUpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});


const UpdateSignUpModel = mongoose.model("UpdateSignUp", UpdateSignUpSchema );


export default UpdateSignUpModel;