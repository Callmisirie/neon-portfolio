import express from "express";
import { ReviewModel } from "../../models/review.js";
import NewsletterModel from "../../models/Newsletter.js";


const router = express.Router();
 
router.get("/read", async (req, res)=> {
    const review = await ReviewModel.find({});
    if(review) {
        res.json(review)
    }
})

router.post("/create", async (req, res) => {
    const {email, name, feedback} = req.body;

    console.log({email, name, feedback});

    if (email && name && feedback) {
        try {
            const reviewDetails = { email, name, feedback};
            const review = new ReviewModel(reviewDetails);
            const reviewResponse = await review.save();
    
    
            const newsletter = await NewsletterModel.findOne({email});
            if (!newsletter) {
                const newsletter = new NewsletterModel({email});
                const newsletterResponse = await newsletter.save();
            }
    
            res.json({
                message: "Review uploaded successfully",
                color: "green"
            }); 
        } catch (error) {
            console.error(error)
            res.json({
                message: "Error uploading review", 
                color: "red"
            });
        }
    } else {
        res.json({
            message: "Failed to upload review, missing fields", 
            color: "red"
        });
    }
  
  
});


router.delete("/delete", async (req, res) => {
    const {id, email} = req.body;
    console.log("Deleting review with ID:", id);
    console.log("Testing:", req.body);

    if (id) {
        const review = await ReviewModel.findOne({_id: id});   
        if (review && email === review.email) {
            try {
                const review = await ReviewModel.findOneAndDelete({_id: id});
                console.log("Deleted review:", review);

                if (review) {
                    res.json({
                        message: "Review deleted", 
                        color: "green"
                    });
                } else {
                    res.json({
                        message: "Review not found", 
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                res.json({
                    message: "Failed to delete review", 
                    color: "red"
                });
            }
        } else if (!email === review.email) {
            res.json({
                message: "Failed to delete review, review email does not match",
                color: "red"
            });
        }
    } else {
        res.json({
            message: "Failed to delete review, review not selected",
            color: "red"
        });
    }
});


router.put("/edit", async (req, res) => { 
    const { id, email, name, feedback } = req.body;

        if (id) {
            try {
                if (email || name || feedback){
                    if (email) {
                        await ReviewModel.findOneAndUpdate({_id: id}, { email }, { new: true });   
                    }   if (name) {
                        await ReviewModel.findOneAndUpdate({_id: id}, { name }, { new: true });   
                    }   if (feedback) {
                        await ReviewModel.findOneAndUpdate({_id: id}, { feedback }, { new: true });   
                    }   
                    res.json({ 
                        message: "Review updated successfully",
                        color: "green"
                    });     
                } else if (!email && !name && !feedback) {
                    res.json({
                        message: "Failed to edit review, missing fields",
                        color: "red"
                    });
                }
            } catch (error) {
                console.error("Error updating review:", error);
                res.json({
                    message: "Failed to update review", 
                    color: "red"
                });
            }
        }  else {
            res.json({
                message: "Failed to edit review, review not selected",
                color: "red"
            });
        }
});


export {router as reviewRouter};