import express from "express";
import multer from "multer";
import { CommissionModel } from "../../models/Commission.js";
import { ImageModel } from "../../models/Manga.js";


const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});

const router = express.Router();
 
router.get("read", (req, res)=> {
    const commission = CommissionModel.find({});
    if(commission) {
        res.json(commission)
    }
})

router.post("/create", upload.single("artImage"), async (req, res)=> {
    const commissionNumber = await CommissionModel.find();
  
    if(commissionNumber.length < 3){
        const commissionDetails = {
            artStyle: req.body.artStyle, 
            artImage: req.file.originalname,
            price: req.body.price,
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

        res.json({commissionResponse, imageResponse});
    } else {
        res.json({message: "Maximum Number of Commission"});
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
                    res.json({message: "Commission deleted"});
                } else {
                    res.status(404).json({message: "Commssion not found"});
                }
            } catch (error) {
                console.error("Error deleting commission:", error);
                res.status(500).json({message: "Failed to delete commission"});
            }
        }
    }
});


router.put("/edit", upload.single("artImage"), async (req, res) => { 
    const { id, artStyle, price, discount, discountInterval } = req.body;
   
        if (id) {
            try {
                if (req.file && artStyle && price && discount && discountInterval){
                    const commission = await CommissionModel.findOneAndUpdate(
                        {_id: id}, 
                        { artStyle: artStyle, artImage: req.file.originalname, price: price, discount: discount, discountInterval: discountInterval}, 
                        { new: true });

                    if (!commission) {
                        return res.status(404).json({ message: "Commission not found" });
                    }
                    res.json({ message: "Commission updated successfully", commission });
                
                }  else if (req.file || artStyle || price || discount || discountInterval){
                    if (req.file) {
                        const commission = await CommissionModel.findOneAndUpdate({_id: id}, {artImage: req.file.originalname}, { new: true });
                        const image = await ImageModel.findOneAndUpdate({imageID: id}, {name: req.file.originalname, imageData: req.file.buffer}, { new: true });

                        if (commission) {
                            res.json({ message: "Commission updated successfully", commission });
                        }
                        else{
                            return res.status(404).json({ message: "Commission not found" });
                        }
                    }   if (artStyle) {
                            const commission = await CommissionModel.findOneAndUpdate({_id: id}, { artStyle: artStyle}, { new: true });

                        if (commission) {
                            res.json({ message: "Commission updated successfully", commission });
                        }
                        else{
                            return res.status(404).json({ message: "Commission not found" });
                        }
                    }   if (price) {
                            const commission = await CommissionModel.findOneAndUpdate({_id: id}, { price: price}, { new: true });

                        if (commission) {
                            res.json({ message: "Commission updated successfully", commission });
                        }
                        else{
                            return res.status(404).json({ message: "Commission not found" });
                        }
                    }   if (discount) {
                            const commission = await CommissionModel.findOneAndUpdate({_id: id}, { discount: discount}, { new: true });

                        if (commission) {
                            res.json({ message: "Commission updated successfully", commission });
                        }
                        else{
                            return res.status(404).json({ message: "Commission not found" });
                        }
                    }   if (discountInterval) {
                        const commission = await CommissionModel.findOneAndUpdate({_id: id}, { discountInterval: discountInterval}, { new: true });

                        if (commission) {
                            res.json({ message: "Commission updated successfully", commission });
                        }
                        else{
                            return res.status(404).json({ message: "Commission not found" });
                        }
                    }       
                }
            } catch (error) {
                console.error("Error updating commission:", error);
                res.status(500).json({ message: "Failed to update commission" });
            }
        }
});


export {router as commissionRouter};