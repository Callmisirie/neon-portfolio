import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ReviewCard from "../components/ReviewCard.jsx";
import NumberOfOrders from "../components/NumberOfOrders";

const Commission = () => {
    const [commissions, setCommissions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [commissionID, setCommissionID] = useState(null);
    const [selectedReviewIndices, setSelectedReviewIndices] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchCommission = async () =>{
            try {
                const commissionResponse = await axios.get("http://localhost:4001/manager/commission/read") 
                setCommissions(commissionResponse.data)

                const reviewResponse = await axios.get("http://localhost:4001/manager/review/read") 
                setReviews(reviewResponse.data)
            } catch (error) {
               console.error(error);
            }
        }
        fetchCommission();
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

    

    function handleChooseArtStyle(id) {
      setCommissionID(id === commissionID ? null : id)
    }

    function handleCreate() {
      navigate("/review/create")
      window.scrollTo(0, 0);
    };


    return (
        <section className="min-h-full">
            <div className=" flex flex-wrap justify-center items-center mx-20 rounded-lg 
            bg-white px-6">
              <div  className="flex sm:flex-row flex-col justify-center items-center rounded-lg my-20 
                bg-white px-6 shadow-xl py-5
                ring-slate-900/5">
                <div  className="flex flex-col justify-center items-center
                bg-white mx-2 px-6 py-5 my-5">
                  <h3 className="text-4xl leading-[68px] 
                  lg:max-w-md font-palanquin font-bold p-2 mb-10 text-center">
                    Choose Art Style
                  </h3>
                  <div className="flex flex-col justify-center items-center rounded-lg 
                  bg-white px-6 shadow-xl py-2 my-10
                  ring-slate-900/5">
                    {commissions.map(commission => (
                      <p className="font-montserrat 
                      text-slate-gray hover:text-black 
                      text-md hover:font-semibold px-2
                      leading-8 my-2 cursor-pointer w-full"
                      key={commission._id}
                      onClick={()=> {
                        handleChooseArtStyle(commission._id)
                      }}>
                        {commission.artStyle}
                      </p>
                    ))}
                  </div>
                </div>
               
                <ul className="flex flex-col justify-center items-center">
                  {commissions.map(commission => (
                    commission._id === commissionID && (
                      <li  className="flex justify-center items-center rounded-lg 
                      bg-white p-2 m-5 shadow-xl
                      ring-slate-900/5"
                      key={commission._id}>
                        <div  className="flex flex-col justify-center items-center  p-2">
                          <h3 className="font-montserrat 
                          text-slate-gray text-lg 
                          leading-8 my-2 w-full text-center">
                            {commission.artStyle}
                          </h3>
                          <img className="flex flex-col justify-center rounded-xl m-2 shadow-xl"
                            src={`http://localhost:4001/display/${commission._id}`} 
                            alt={`Manga ${commission.artImage}`} 
                            style={{ width: "120px" }}
                          />
                          <NumberOfOrders commission={commission}/>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              </div>           
            </div>
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
                                    key={review.email}
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
          </section>
      );
}

export default Commission;