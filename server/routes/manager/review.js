import express from "express";
import { ReviewModel } from "../../models/Review.js";
import UserModel from "../../models/User.js";

const router = express.Router();
 
router.get("/read", async (req, res)=> {
    const review = await ReviewModel.find({});
    if(review) {
        res.json(review)
    }
})

router.post("/create", async (req, res) => {
    const {userID, name,  feedback} = req.body;

    console.log({userID, name, feedback});

    const user = await UserModel.findOne({_id : userID});

        if (user && name && feedback) {
            try {
                const reviewDetails = { email: user.email, name, feedback};
                const review = new ReviewModel(reviewDetails);
                const reviewResponse = await review.save();
        
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
    const {id, name} = req.body;
    console.log("Deleting review with ID:", id);
    console.log("Testing:", req.body);

    if (id) {
        const review = await ReviewModel.findOne({_id: id});   
        if (review && name === review.name) {
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
        } else if (name !== review.name) {
            res.json({
                message: "Failed to delete review, name does not match",
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
    const { id, name, feedback } = req.body;

        if (id) {
            try {
                if (name || feedback){  
                    if (name) {
                        await ReviewModel.findOneAndUpdate({_id: id}, { name }, { new: true });   
                    }   if (feedback) {
                        await ReviewModel.findOneAndUpdate({_id: id}, { feedback }, { new: true });   
                    }   
                    res.json({ 
                        message: "Review updated successfully",
                        color: "green"
                    });     
                } else if (!name && !feedback) {
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