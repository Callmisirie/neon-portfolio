import express from "express";
import multer from "multer";
import { PaypalGiftModel, CryptoGiftModel } from "../../models/Gift.js";
import { ImageModel } from "../../models/Manga.js";


const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});

const router = express.Router();
 
router.get("/read", async (req, res)=> {
    const paypalGift = await PaypalGiftModel.find({});
    const cryptoGift = await CryptoGiftModel.find({});
    if(paypalGift || cryptoGift) {
        res.json({paypalGift, cryptoGift})
    }
})

router.post("/create", upload.single("qrCodeImage"), async (req, res)=> {
    const paypalGift = await PaypalGiftModel.find();
    const cryptoGift = await CryptoGiftModel.find();
    const {isClickedPaypal , isClickedCrypto} = req.body;
  

    try {
        if(isClickedPaypal) {
            if( paypalGift.length < 2){
                console.log("pal: "+isClickedPaypal);
                const paypalGiftDetails = {
                    address: req.body.address, 
                    username: req.body.username
                };
    
                const paypalGift = new PaypalGiftModel( paypalGiftDetails);
                const paypalGiftResponse = await paypalGift.save();

                res.json({
                    message: "Paypal Gift uploaded successfully",
                    color: "green"
                });
            } else {
                res.json({
                    message: "Max Paypal Gift",
                    color: "red"
                });
            }
        }
        
        if(isClickedCrypto) {
            if(cryptoGift.length < 5){
                console.log("cry: " + isClickedCrypto);
                const cryptoGiftDetails = {
                    cryptoName: req.body.cryptoName, 
                    address: req.body.address,
                    network: req.body.network,
                    qrCodeImage: req.file.originalname,
                };
                const cryptoGift = new CryptoGiftModel(cryptoGiftDetails);
                const cryptoGiftResponse = await cryptoGift.save();
        
                const imageDetails = {
                    imageID: cryptoGiftResponse._id,
                    name: req.file.originalname, 
                    imageData: req.file.buffer
                };
        
                const image = new ImageModel(imageDetails);
                const imageResponse =  await image.save();
    
                res.json({
                    message: "Crypto Gift uploaded successfully",
                    color: "green"
                });
        
            } else {
                res.json({
                    message: "Max Crypto Gift",
                    color: "red"
                });
            }
        }
    } catch (error) {
        console.error(error)
        res.json({
            message: "Error uploading gift",
            color: "red"
        });
    }
 

});


router.delete("/delete", async (req, res) => {
    const {
        cryptoGiftId, cryptoName, 
        paypalGiftId, paypalAddress
    } = req.body;

    console.log("Deleting paypalGift with ID:" , paypalGiftId);
    console.log("Deleting cryptoGift with ID:" , cryptoGiftId);
    console.log("Testing:", req.body);

    if (paypalGiftId || cryptoGiftId ) {
        const paypalGift = await PaypalGiftModel.findOne({_id: paypalGiftId});   
        const cryptoGift = await CryptoGiftModel.findOne({_id: cryptoGiftId}); 
        if (paypalGift && paypalAddress === paypalGift.address) {
            try {
                const paypalGift = await PaypalGiftModel.findOneAndDelete({_id: paypalGiftId});
                console.log("Deleted gift:", paypalGift);

                if (paypalGift) {
                    res.json({ 
                        message: "Paypal deleted", 
                        color: "green"
                    });
                } else {
                    res.json({
                        message: "Paypal not found",
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error deleting paypal gift:", error);
                res.json({ 
                    message: "Internal server error, Failed to delete paypal gift", 
                    color: "red"
                });
            }
        } else if (paypalGift && paypalAddress !== paypalGift.address) {
            res.json({
                message: "Failed to delete paypal gift, paypal address does not match",
                color: "red"
            });
        }
        if (cryptoGift && cryptoName === cryptoGift.cryptoName) {
            try {
                const cryptoGift = await CryptoGiftModel.findOneAndDelete({_id: cryptoGiftId});
                console.log("Deleted crypto:", cryptoGift);

                const images = await ImageModel.deleteOne({ imageID: cryptoGift._id })
                console.log("Deleted crypto image:", images.deletedCount);
  
                if (cryptoGift) {
                    res.json({ 
                        message: "Crypto deleted", 
                        color: "green"
                    });
                } else {
                    res.json({
                        message: "Crypto not found",
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error deleting gift", error);
                res.json({ 
                    message: "Internal server error, Failed to delete gift", 
                    color: "red"
                });
            }
        } else if (cryptoGift && cryptoName !== cryptoGift.cryptoName) {
            res.json({
                message: "Failed to delete crypto gift, crypto name does not match",
                color: "red"
            });
        }
    }  else if (!isClickedPaypal && !isClickedCrypto) {
        res.json({
            message: "Error deleting gift, gift not selected",
            color: "red"
        });
    }
});


router.put("/edit", upload.single("qrCodeImage"), async (req, res) => { 
    const { paypalGiftId, paypalAddress, 
        username, cryptoGiftId, cryptoName, 
        cryptoAddress, network,
        isClickedPaypal, isClickedCrypto
    } = req.body;
   
    if (paypalGiftId || cryptoGiftId) {   
        if(isClickedPaypal) {
            if (paypalAddress || username){
                try {
                    if (paypalAddress) {
                        await PaypalGiftModel.findOneAndUpdate({_id: paypalGiftId}, { address: paypalAddress}, { new: true });   
                    }   if (username) {
                        await PaypalGiftModel.findOneAndUpdate({_id: paypalGiftId}, { username: username}, { new: true });   
                    }
                        res.json({
                            message: "Paypal updated successfully",
                            color: "green"
                        });
                } catch (error) {
                    console.error("Error updating paypal", error);
                    res.json({
                        message: "Failed to update paypal",
                        color: "red"
                    });
                    
                }   
            } else if (!paypalAddress && !username) {
                res.json({
                    message: "Failed to edit paypal gift, missing fields",
                    color: "red"
                });
            }
        } 
        if(isClickedCrypto) {
            if (req.file || cryptoName || cryptoAddress || network){
                try {
                    if (req.file) {
                        await CryptoGiftModel.findOneAndUpdate({_id: cryptoGiftId}, {qrCodeImage: req.file.originalname}, { new: true });
                        await ImageModel.findOneAndUpdate({imageID: cryptoGiftId}, {name: req.file.originalname, imageData: req.file.buffer}, { new: true });
                    }   if (cryptoName) {
                        await CryptoGiftModel.findOneAndUpdate({_id: cryptoGiftId}, { cryptoName:  cryptoName}, { new: true });   
                    }   if (cryptoAddress) {
                        await CryptoGiftModel.findOneAndUpdate({_id: cryptoGiftId}, { address: cryptoAddress}, { new: true });   
                    }   if (network) {
                        await CryptoGiftModel.findOneAndUpdate({_id: cryptoGiftId}, { network: network}, { new: true });
                    }     
                    res.json({
                        message: "Crypto updated successfully",
                        color: "green"
                    });
                }   catch (error) {
                    console.error("Error updating crypto", error);
                    res.json({
                        message: "Failed to update crypto",
                        color: "red"
                    });
                } 
            }  else if (!req.file && !cryptoName && !cryptoAddress && !network) {
                res.json({
                    message: "Failed to edit crypto gift, missing fields",
                    color: "red"
                });
            }
        } 
    }  else if (!paypalGiftId && !cryptoGiftId) {
        res.json({
            message: "Error editing gift, gift not selected",
            color: "red"
        });
    }
});


export {router as giftRouter};