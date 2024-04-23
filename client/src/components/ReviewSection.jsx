import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios"
import ReviewCard from './ReviewCard';

const ReviewSection = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [selectedReviewIndices, setSelectedReviewIndices] = useState([]);
    
    function handleCreate() {
        navigate("/review/create")
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchReview = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/review/read") 
                setReviews(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchReview();
    }, []);

    useEffect(() => {
        let indices = [];
        if (reviews.length > 0) {
            if (reviews.length > 3) {
                while (indices.length < 3) {
                    const randomNumber = Math.floor(Math.random() * reviews.length);
                    if (!indices.includes(randomNumber)) {
                        indices.push(randomNumber);
                    }
                }
            } else {
                indices = Array.from(Array(reviews.length).keys());
            }
        }
        setSelectedReviewIndices(indices);
    }, [reviews]);


    return (
        <section className="bg-pale-blue padding">
            <section className="max-container">
                <h3 className="text-4xl leading-[68px] 
                text-center font-palanquin font-bold">
                    What Our <span className="text-purple-600"> Customers </span> Say?
                </h3>
                <p className="info-text m-auto 
                mt-4 text-center max-w-lg ">
                    Hear genuine stories from our 
                    satisfied customers about their
                    exceptional experiences with us.
                </p>
                <div className="mt-24 flex flex-1 
                justify-evenly items-center 
                max-lg:flex-col gap-14">
                    {selectedReviewIndices && selectedReviewIndices.map((index) => {
                        const review = reviews[index];
                        return (
                            <ReviewCard 
                                key={review._id}
                                customerName={review.name}
                                feedback={review.feedback}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-center mt-10">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1
                    bg-purple-600 rounded-full hover:bg-purple-500"
                    onClick={handleCreate}> 
                        Post Review
                    </button>
                </div>
            </section>    
        </section>
    )
}

export default ReviewSection