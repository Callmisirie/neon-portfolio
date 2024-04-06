import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
    artStyle: {
        type: String,
        required: true,
        unique: true
    },
    artImage: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pricePer: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    discountInterval: {
        type: Number,
        required: true
    }
});

const CommissionModel = mongoose.model("Commission", commissionSchema);

export {CommissionModel};