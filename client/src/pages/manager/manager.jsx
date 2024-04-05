import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function Manager() {
    const navigate = useNavigate();

    function handleManga() {
        navigate("/manager/manga")
    };

    function handleCommission() {
        navigate("/manager/commission")
    };

    function handleSupport() {
        navigate("/manager/support")
    };

    function handleReview() {
        navigate("/manager/review")
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
                    onClick={handleSupport}> 
                        Support
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