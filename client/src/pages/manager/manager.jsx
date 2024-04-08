import React from 'react';
import { useNavigate } from 'react-router-dom';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function Manager() {
    const navigate = useNavigate();

    function handleManga() {
        navigate("/manager/manga")
        window.scrollTo(0, 0);
    };

    function handleCommission() {
        navigate("/manager/commission")
        window.scrollTo(0, 0);
    };

    function handleGift() {
        navigate("/manager/gift")
        window.scrollTo(0, 0);
    };

    function handleReview() {
        navigate("/manager/review")
        window.scrollTo(0, 0);
    }

  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                ADMIN MANAGER
            </h2>
            <div className="flex flex-wrap justify-center items-center mx-10 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5">
                
                <div className="flex flex-col justify-center items-center my-5 mx-10 rounded-lg 
                bg-white px-10 py-8 shadow-xl
                ring-slate-900/5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:bg-purple-500"
                    onClick={handleManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:bg-purple-500"
                    onClick={handleCommission}> 
                        Commission
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:bg-purple-500"
                    onClick={handleGift}> 
                        Gift
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:bg-purple-500"
                    onClick={handleReview}> 
                        Review
                    </button>
                </div>
            </div>
        </section>
  )  
};


export default Manager;