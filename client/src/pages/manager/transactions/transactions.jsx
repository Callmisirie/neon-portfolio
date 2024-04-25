import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function TransactionsManager() {
    const navigate = useNavigate();

    function handleStatus() {
        navigate("/manager/transactions/status")
        window.scrollTo(0, 0);
    };

    function handleDelete() {
        navigate("/manager/transactions/delete")
        window.scrollTo(0, 0);
    };

  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                TRANSACTIONS MANAGER
            </h2>
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5">
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-10 py-8 shadow-xl
                ring-slate-900/5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleStatus}> 
                        Status
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleDelete}> 
                        Delete
                    </button>
                </div>
            </div>
        </section>
  )  
};


//////////////////////////////////////////////////////////////////////////EDIT COMMISSION//////////////////////////////////////////////////////////////////////////


function TransactionsStatus() {
  const [reviews, setReviews] = useState([]);
  const [reviewID, setReviewID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [actionMessage, setActionMessage] = useState("Edit Review");
  const [isDisabled, setIsDisabled] = useState(false);


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
  }, [reviews]);

  const handleClick = (email, name, feedback, id) => {
      setEmail(email);
      setName(name);
      setFeedback(feedback);
      setReviewID(id);
      setMessage("");;
      
  }

  const handleSubmit = async (e) => {
      e.preventDefault();

      setActionMessage("Pocessing...");
      setIsDisabled(true);

      try {
      const response = await axios.put("http://localhost:4001/manager/review/edit", {
          id: reviewID,
          email:  newEmail,
          name: newName,
          feedback: newFeedback
      });

      const {message, color} = response.data;
      setMessage(message);
      setMessageColor(color);
      setEmail("");;
      setName("");
      setFeedback("");
      setNewEmail("");
      setNewName("");
      setNewFeedback("");
      setReviewID("");
      setActionMessage("Edit Review");
      setIsDisabled(false);
      } catch (error) {
      setMessage("Error updating review");
      setMessageColor("red")
      setEmail("");;
      setName("");
      setFeedback("");
      setNewEmail("");
      setNewName("");
      setNewFeedback("");
      setReviewID("");
      setActionMessage("Edit Review");
      setIsDisabled(false);
      console.error(error);  
      }
  };

return (
  <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
  bg-white px-6">
      <div className="flex flex-col justify-center items-center rounded-lg mb-10
      bg-white px-6 shadow-xl
      ring-slate-900/5">
          <h2 className="text-3xl leading-[68px] 
          lg:max-w-md font-palanquin font-bold p-2">
              Edit Review
          </h2>
          <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
          bg-white px-6 py-3 shadow-xl
          ring-slate-900/5'>
              {reviews.map((review)=> {
                  return (
                      <li key={review._id}>
                          <p className="font-montserrat 
                          text-slate-gray hover:text-black text-md 
                          leading-8 my-2 cursor-pointer w-full"
                              onClick={()=> {
                              handleClick(
                                  review.email,
                                  review.name,
                                  review.feedback,
                                  review._id)
                          }}>
                              {review.name}
                          </p>
                      </li>
                  )
              })}
          </ul>
          <h3 className="font-montserrat 
          text-slate-gray text-xl 
          leading-8 mt-6 text-center">
              <span className='font-montserrat font-bold'>UPDATE - </span>     
              {email} 
          </h3>
          {message && <p className="font-montserrat text-lg 
          leading-8 my-2"  style={{ color:`${messageColor}`}}>
              {message}
          </p>}
          <form  className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
          bg-white px-6 py-4 shadow-xl
          ring-slate-900/5"
          onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center m-5 rounded-lg 
              bg-white px-6 py-4 shadow-xl
              ring-slate-900/5">
                  <p className='mt-4 font-bold font-montserrat text-slate-gray'>Email</p>
                  <Input type="email" 
                  value={newEmail} 
                  placeholder={email} 
                  handleChange={setNewEmail}
                  resetMessage={setMessage} />
                  <p className='mt-4 font-bold font-montserrat text-slate-gray'>Name</p>
                  <Input type="text" 
                  value={newName} 
                  placeholder={name} 
                  handleChange={setNewName}
                  resetMessage={setMessage} />
                  <p className='mt-4 font-bold font-montserrat text-slate-gray'>Feedback</p> 
                  <TextArea type="text"
                  value={newFeedback}
                  setValue={setNewFeedback}
                  resetMessage={setMessage}
                  placeholder={feedback}
                  />
              </div>           
              <button className="gap-2 px-7 py-4 my-2 border 
              font-montserrat text-lg leading-none bg-black
              rounded-full text-white border-black mb-5" 
              type="submit"
              disabled={isDisabled}>
                  {actionMessage}
              </button>
          </form>
      </div>
  </div>
)};


//////////////////////////////////////////////////////////////////////////DELETE REVIEW//////////////////////////////////////////////////////////////////////////


function TransactionsDelete() {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState("");
    const [selectedReviewID, setSelectedReviewID] = useState("");
    const [deleteReview, setDeleteReview] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Delete Review");
    const [isDisabled, setIsDisabled] = useState(false);


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
    }, [reviews]);

const handleReviewClick = (id, email) => {
    setSelectedReviewID(id);
    setSelectedReview(email);
    setMessage("");
}

const handleDeleteReviewClick = async () => {
    setActionMessage("Processing");
    setIsDisabled(true);

    try {
        const response = await axios.delete("http://localhost:4001/manager/review/delete", { data: {id: selectedReviewID, email: deleteReview} });
        
        const {message, color} = response.data;
        setMessage(message);
        setMessageColor(color)
        setDeleteReview("");
        setSelectedReview("");
        setSelectedReviewID("");
        setActionMessage("Delete Review");
        setIsDisabled(false);
    } catch (error) {
        setMessage("Error deleting commission");
        setMessageColor("red");
        setDeleteReview("");
        setSelectedReview("");
        setSelectedReviewID("");
        setActionMessage("Delete Review");
        setIsDisabled(false);
        console.error(error)
    }
}

  return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
            <div  className="flex flex-col justify-center items-center rounded-lg mb-10
                bg-white px-10 py-4 shadow-xl
                ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Delete Review
                </h2>
                {message && <p className="font-montserrat text-lg 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 pb-6 shadow-xl
                ring-slate-900/5'>
                    {reviews.map((review)=> {
                        return (
                            <>
                                <li 
                                onClick={()=> {
                                    handleReviewClick(review._id, review.email )
                                }}
                                key={review._id}>
                                    <p  className="font-montserrat 
                                    text-slate-gray hover:text-black text-md 
                                    leading-8 my-2 cursor-pointer w-full">
                                        {review.name}
                                    </p>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <p  className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-6 text-center">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedReview}
                    <span className='font-bold font-montserrat'>" to delete Review.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray 
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {
                    setDeleteReview(e.target.value)
                    setMessage("");
                    }} 
                placeholder="Email" 
                value={deleteReview} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeleteReviewClick}
                disabled={isDisabled}>
                    {actionMessage}
                </button>
            </div>
    </div>
)};




export default TransactionsManager;
export {TransactionsStatus, TransactionsDelete};