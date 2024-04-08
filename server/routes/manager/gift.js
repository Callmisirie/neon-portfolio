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
  
    if (paypalGift || cryptoGift) {
        if(isClickedPaypal) {
            if( paypalGift.length < 2){
                console.log("pal: "+isClickedPaypal);
                const paypalGiftDetails = {
                    address: req.body.address, 
                    username: req.body.username
                };
    
                const paypalGift = new PaypalGiftModel( paypalGiftDetails);
                const paypalGiftResponse = await paypalGift.save();
    
                res.json(paypalGiftResponse);
            } else {
                res.json({message: "Max Paypal Gift"});
            }
        }
        
        if(isClickedCrypto) {
            if(cryptoGift.length < 5){
                console.log("cry: "+isClickedCrypto);
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
    
                res.json(cryptoGiftResponse);
        
            } else {
                res.json({message: "Max Crypto Gift"});
            }
        } 
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
                console.log("Deleted commission:", paypalGift);

  
                if (paypalGift) {
                    res.json({message: "Paypal deleted"});
                } else {
                    res.status(404).json({message: "Paypal not found"});
                }
            } catch (error) {
                console.error("Error deleting commission:", error);
                res.status(500).json({message: "Failed to delete commission"});
            }
        }
        if (cryptoGift && cryptoName === cryptoGift.cryptoName) {
            try {
                const cryptoGift = await CryptoGiftModel.findOneAndDelete({_id: cryptoGiftId});
                console.log("Deleted crypto:", cryptoGift);

                const images = await ImageModel.deleteOne({ imageID: cryptoGift._id })
                console.log("Deleted crypto image:", images.deletedCount);
  
                if (cryptoGift) {
                    res.json({message: "Crypto deleted"});
                } else {
                    res.status(404).json({message: "Crypto not found"});
                }
            } catch (error) {
                console.error("Error deleting gift", error);
                res.status(500).json({message: "Failed to delete gift"});
            }
        }
    }
});


router.put("/edit", upload.single("qrCodeImage"), async (req, res) => { 
    const { paypalGiftId, paypalAddress, username} = req.body;
    const { cryptoGiftId, cryptoName, cryptoAddress, network} = req.body;
   
    if (paypalGiftId || cryptoGiftId) {          
        if (paypalAddress || username){
            try {
                if (paypalAddress) {
                    await PaypalGiftModel.findOneAndUpdate({_id: paypalGiftId}, { address: paypalAddress}, { new: true });   
                }   if (username) {
                    await PaypalGiftModel.findOneAndUpdate({_id: paypalGiftId}, { username: username}, { new: true });   
                }
                    res.json({ message: "Paypal updated successfully"}); 
            } catch (error) {
                console.error("Error updating paypal", error);
                res.status(500).json({ message: "Failed to update paypal" });
            }   
        }   

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
                    res.json({ message: "Crypto updated successfully"});
                }     
            }   catch (error) {
                console.error("Error updating crypto", error);
                res.status(500).json({ message: "Failed to update crypto" });
            } 
        }  
    }
});


export {router as giftRouter};