import express from "express";
import multer from "multer";
import { CommissionModel } from "../../models/Commission.js";
import { ImageModel } from "../../models/Manga.js";


const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});

const router = express.Router();
 
router.get("/read", async (req, res)=> {
    const commission = await CommissionModel.find({});
    if(commission) {
        res.json(commission)
    }
})

router.post("/create", upload.single("artImage"), async (req, res)=> {
    const commissionNumber = await CommissionModel.find();
  
    if(commissionNumber.length < 3){
        try {
            const commissionDetails = {
                artStyle: req.body.artStyle, 
                artImage: req.file.originalname,
                price: req.body.price,
                pricePer: req.body.pricePer,
                discount: req.body.discount,
                discountInterval: req.body.discountInterval
            };
            const commission = new CommissionModel(commissionDetails);
            const commissionResponse = await commission.save();
    
            const imageDetails = {
                imageID: commissionResponse._id,
                name: req.file.originalname, 
                imageData: req.file.buffer
            };
    
            const image = new ImageModel(imageDetails);
            const imageResponse =  await image.save();
    
            res.json({
                message: "Commission uploaded successfully",
                color: "green"
            }); 
        } catch (error) {
            console.error(error)
            res.json({
                message: "Error uploading Commission", 
                color: "red"
            });
        }
        
    } else {
        res.json({
            message: "Maximum Number of Commission", 
            color: "red"
        });
    }
  
});


router.delete("/delete", async (req, res) => {
    const {id, artStyle} = req.body;
    console.log("Deleting commission with ID:", id);
    console.log("Testing:", req.body);

    if (id) {
        const commission = await CommissionModel.findOne({_id: id});   
        if (commission && artStyle === commission.artStyle) {
            try {
                const commission = await CommissionModel.findOneAndDelete({_id: id});
                console.log("Deleted commission:", commission);

                const images = await ImageModel.deleteOne({ imageID: commission._id })
                console.log("Deleted commission image:", images.deletedCount);
  
                if (commission) {
                    res.json({
                        message: "Commission deleted", 
                        color: "green"
                    });
                } else {
                    res.json({
                        message: "Commssion not found", 
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error deleting commission:", error);
                res.json({
                    message: "Failed to delete commission", 
                    color: "red"
                });
            }
        } else if (artStyle !== commission.artStyle) {
            res.json({
                message: "Failed to delete commission, commission art style does not match",
                color: "red"
            });
        }
    } else {
        res.json({
            message: "Failed to delete commission, commission not selected",
            color: "red"
        });
    }
});


router.put("/edit", upload.single("artImage"), async (req, res) => { 
    const { id, artStyle, price, pricePer, discount, discountInterval } = req.body;
   
        if (id) {
            try {
                if (req.file || artStyle || price || pricePer || discount || discountInterval){
                    if (req.file) {
                        await CommissionModel.findOneAndUpdate({_id: id}, {artImage: req.file.originalname}, { new: true });
                        await ImageModel.findOneAndUpdate({imageID: id}, {name: req.file.originalname, imageData: req.file.buffer}, { new: true });
                    }   if (artStyle) {
                        await CommissionModel.findOneAndUpdate({_id: id}, { artStyle: artStyle}, { new: true });   
                    }   if (price) {
                        await CommissionModel.findOneAndUpdate({_id: id}, { price: price}, { new: true });   
                    }   if (pricePer) {
                        await CommissionModel.findOneAndUpdate({_id: id}, { pricePer: pricePer}, { new: true });   
                    }   if (discount) {
                        await CommissionModel.findOneAndUpdate({_id: id}, { discount: discount}, { new: true }); 
                    }   if (discountInterval) {
                        await CommissionModel.findOneAndUpdate({_id: id}, { discountInterval: discountInterval}, { new: true });  
                    }  
                    res.json({ 
                        message: "Commission updated successfully",
                        color: "green"
                    });     
                } else if (!req.file && !artStyle && !price && !pricePer && !discount && !discountInterval) {
                    res.json({
                        message: "Failed to edit commission, missing fields",
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error updating commission:", error);
                res.json({
                    message: "Failed to update commission", 
                    color: "red"
                });
            }
        }  else {
            res.json({
                message: "Failed to edit commission, commission not selected",
                color: "red"
            });
        }
});


export {router as commissionRouter};