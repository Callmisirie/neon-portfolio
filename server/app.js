import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

import { newsletterRouter } from './routes/newsletter.js';
import { adminRouter } from "./routes/admin.js";
import { userRouter } from './routes/user.js';
import { mangaRouter } from "./routes/manga.js";
import { chapterContentRouter } from './routes/chapterContent.js';
import { managerMangaRouter } from './routes/manager/manga.js';
import { ImageModel } from './models/Manga.js';
import { commissionRouter } from './routes/manager/commission.js';
import { giftRouter } from './routes/manager/gift.js';
import { reviewRouter } from './routes/manager/review.js';
import { transactionHistoryRouter } from './routes/transactionHistory.js';
import { passwordResetRouter } from './routes/passwordReset.js';

const app = express();
const password = process.env.MONGO_DB;
const CM_API_KEY = process.env.CM_API_KEY

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect("mongodb+srv://kensirie:"+ password +"@mangacontent.byftaxk.mongodb.net/mangacontent?retryWrites=true&w=majority");

app.use("/newsletter", newsletterRouter);
app.use("/auth/admin", adminRouter);
app.use("/auth/user", userRouter);
app.use("/manga", mangaRouter);
app.use("/chapterContent", chapterContentRouter);
app.use("/manager/manga", managerMangaRouter);
app.use("/manager/commission", commissionRouter);
app.use("/manager/gift", giftRouter);
app.use("/manager/review", reviewRouter);
app.use("/manager/transactionHistory", transactionHistoryRouter);
app.use("/passwordReset", passwordResetRouter);

app.get("/cryptocurrency/latest", async (req, res) => {
    const {cryptoSymbols} = req.query;

    try {
        const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
            headers: {
                'X-CMC_PRO_API_KEY': CM_API_KEY
            }
        });

        let symbolDetails = response.data.data;

        if(cryptoSymbols) {
            symbolDetails = symbolDetails.filter(symbol => cryptoSymbols.includes(symbol.symbol));
        }

        const selectedSymbols = symbolDetails.map(symbolDetail => ({
            symbol: symbolDetail.symbol,
            price:  Number(symbolDetail.quote.USD.price.toFixed(2))
        }));
        
        res.json(selectedSymbols);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch cryptocurrency data" });
    }
});


app.get("/display/:imageID", async (req, res) => {
    const imageID = req.params.imageID;

    if (!mongoose.Types.ObjectId.isValid(imageID)) {
        return res.status(400).json({ message: "Invalid mangaID" });
    }

    try {
        const image = await ImageModel.findOne({ imageID });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.contentType("image/jpeg");
        res.send(image.imageData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(4001, ()=> {
    console.log("Server Running");
});



