import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
    const [transactionHistories, setTransactionHistories] = useState([]);
    const [clickedTransactionHistoryId, setClickedTransactionHistoryId] = useState(null);
    const userID = window.localStorage.getItem("userID");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactionHistories = async () =>{
        try {
    
            const transactionHistoryResponse = await axios.get("https://app.callmineon.com/manager/transactionHistory/read", {
                params: { userID }
            });
    
            setTransactionHistories(transactionHistoryResponse.data.userTransactionHistory)
        } catch (error) {
            console.error(error);
        }
        }
        fetchTransactionHistories();
    }, [transactionHistories]);

    const handleTransactionHistoryClick = (id) => {
        setClickedTransactionHistoryId(id === clickedTransactionHistoryId ? null : id);
      }


    return (
        <section className="min-h-full">
            <section className="flex justify-center padding">
                <section className="max-container rounded-lg bg-white
                px-10 shadow-xl ring-slate-900/5">
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="font-montserrat 
                        text-black font-bold text-3xl
                        leading-8 w-full text-center">
                        Transaction History
                        </h3>
                        <ul className='flex flex-col-reverse mx-5 
                        mt-5 py-3 '> 
                        {transactionHistories && transactionHistories.transactionDetails ? transactionHistories.transactionDetails.map((transactionDetail)=> {
                            return (
                       
                                <li key={transactionDetail._id}>
                                <div className="">
                                    <p className="font-montserrat w-full
                                    text-black text-md leading-8 
                                    my-2 font-semibold
                                    cursor-pointer"
                                    onClick={()=> {handleTransactionHistoryClick(transactionDetail._id)}}>
                                    Transaction ID: <span className="text-sm">{transactionDetail._id}</span> 
                                    </p> 
                                    <div className="px-3">
                                    <p className="font-montserrat 
                                    text-slate-gray leading-8
                                    text-sm w-full">
                                        Art Style - {transactionDetail.artStyle} 
                                    </p>
                                    <p className="font-montserrat 
                                    text-slate-gray leading-8
                                    text-sm w-full">
                                        Quantity - {transactionDetail.quantity}
                                    </p>
                                    <p className="font-montserrat 
                                    text-slate-gray
                                    text-sm leading-8 w-full">
                                        Price - <span className="text-green-600">${transactionDetail.price}</span>
                                    </p>     
                                    <p className="font-montserrat 
                                    text-slate-gray leading-8
                                    text-sm w-full">
                                        Date - {transactionDetail.date}
                                    </p>                              
                                    </div>
                                </div>       
                                <ul className="flex flex-col 
                                mb-5 rounded-lg bg-white
                                shadow-xl ring-slate-900/5">
                                    {clickedTransactionHistoryId === transactionDetail._id && 
                                    <li key={transactionDetail._id}>
                                        <p className="font-montserrat 
                                        text-slate-gray
                                        text-sm leading-8 w-full">
                                        Payment Method - {transactionDetail.paymentMethod}   
                                        </p>  
                                        {transactionDetail.cryptoName && (
                                            <>
                                                <p className="font-montserrat 
                                                text-slate-gray
                                                text-sm leading-8 w-full">
                                                Crypto - {transactionDetail.cryptoName}   
                                                </p>     
                                                <p className="font-montserrat 
                                                text-slate-gray
                                                text-sm leading-8 w-full">
                                                Price In {transactionDetail.cryptoName} - {transactionDetail.priceInCrypto}   
                                                </p>                                 
                                            </>                                    
                                        )}
                                        {transactionDetail.bankCurrency ? (
                                            <p className="font-montserrat 
                                            text-slate-gray
                                            text-sm leading-8 w-full">
                                            Price In {transactionDetail.bankCurrency} - &#x20A6;{transactionDetail.priceInSubCurrency}   
                                            </p>                               
                                        ) : null}
                                        <p className="font-montserrat 
                                        text-slate-gray
                                        text-sm leading-8 w-full">
                                        Status - {transactionDetail.paymentStatus}   
                                        </p>
                                        <p className="font-montserrat 
                                        text-slate-gray
                                        text-sm leading-8 w-full">
                                        Discount - <span className="font-montserrat 
                                        text-slate-gray text-start font-normal
                                        text-sm">applies {`${transactionDetail.discount}%
                                        to every ${transactionDetail.discountInterval}
                                        ${transactionDetail.pricePer}s`}</span>   
                                        </p>
                                    </li>                                 
                                    }
                                </ul>   
                                </li>
                          
                            )
                        }) : null}
                        </ul>
                        <div className="mb-5">
                            <p  className="font-montserrat 
                            text-purple-600 text-center hover:font-bold
                            text-md font-semibold">
                                <a href="/commission">
                                Back to commission
                                </a>
                            </p>
                        </div>                    
                    </div>              
                </section>
            </section>        
        </section>
                    
    )
}

export default TransactionHistory