import React, { useState} from 'react';
import { clipboardCopy } from "../assets/icons";

const Order = () => {
    const [copyTooltip, setCopyTooltip] = useState("Copy");
    const orderDetails = JSON.parse(window.localStorage.getItem("orderDetails"));

    function handleCopyClipboard(content) {
        setCopyTooltip("Copied!");
        
        navigator.clipboard.writeText(content)
            .then(() => {
                console.log('Copied to clipboard');
                setTimeout(() => {
                    setCopyTooltip("Copy");
                }, 2000);
            })
            .catch((error) => {
                console.error('Failed to copy: ', error);
            });
    }

    return (
        <section className="min-h-full">
            <div className='flex justify-center'>
                <div className="flex gap-5
                flex-col justify-center
                max-container m-10 rounded-lg 
                bg-white p-10 shadow-xl
                ring-slate-900/5">
                    <h3 className="text-3xl leading-[68px] 
                    g:max-w-md font-montserrat font-bold p-2 mx-10 text-center">
                        Order Details 
                    </h3>
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Art Style - <span className="font-montserrat 
                        text-slate-gray text-start font-normal
                        text-sm">{orderDetails.artStyle}</span>
                    </p>
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Quantity - <span className="font-montserrat 
                        text-slate-gray text-start font-normal
                        text-sm">{orderDetails.quantity}</span>
                    </p>
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Price - <span className="font-montserrat 
                        text-green-600 text-start font-normal
                        text-sm">${orderDetails.price}</span>    
                    </p>
                    {orderDetails.paymentMethod === "Crypto" ? (
                        <div className='flex items-center max-w-fit'>
                            <p className="font-montserrat font-semibold
                            text-slate-gray text-start
                            text-sm">
                                Price in {orderDetails.cryptoName}  - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">{orderDetails.priceInCrypto}</span>       
                            </p>
                            <div className='flex
                            justify-center items-center 
                            cursor-pointer ml-10'
                            onClick={() => handleCopyClipboard(orderDetails.priceInCrypto)}>
                                <img className="mx-2 
                                rounded-full w-4 h-4"
                                src={clipboardCopy}/> 
                                <p className="font-montserrat 
                                text-slate-gray text-sm
                                    text-center">
                                    {copyTooltip}
                                </p>                                                                    
                            </div> 
                        </div>           
                    ): null}
                    {orderDetails.bankCurrency === "NGN" ? (
                        <div className='flex items-center max-w-fit'>
                            <p className="font-montserrat font-semibold
                            text-slate-gray text-start
                            text-sm">
                                Price in {orderDetails.bankCurrency}  - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">&#x20A6;{orderDetails.priceInSubCurrency}</span>       
                            </p>
                            <div className='flex
                            justify-center items-center 
                            cursor-pointer ml-10'
                            onClick={() => handleCopyClipboard(orderDetails.priceInSubCurrency)}>
                                <img className="mx-2 
                                rounded-full w-4 h-4"
                                src={clipboardCopy}/> 
                                <p className="font-montserrat 
                                text-slate-gray text-sm
                                    text-center">
                                    {copyTooltip}
                                </p>                                                                    
                            </div>                                         
                        </div>
                    ) : null}
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Discount - <span className="font-montserrat 
                        text-slate-gray text-start font-normal
                        text-sm">{`${orderDetails.discount}%
                        applies to every ${orderDetails.discountInterval} 
                        ${orderDetails.pricePer}${orderDetails.number > (1) ? "s" : ""}`}</span>   
                    </p>
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Payment Method - <span className="font-montserrat 
                        text-slate-gray text-start font-normal
                        text-sm">{orderDetails.paymentMethod}</span>
                    </p>
                    {orderDetails.cryptoName && (
                        <p className="font-montserrat font-semibold
                        text-slate-gray max-w-xs text-start
                        text-sm">
                            Crypto - <span className="font-montserrat 
                            text-slate-gray text-start font-normal
                            text-sm">{orderDetails.cryptoName}</span>
                        </p>                                
                    )}   
                    <p className="font-montserrat font-semibold
                    text-slate-gray max-w-xs text-start
                    text-sm">
                        Payment Status - <span className="font-montserrat 
                        text-slate-gray text-start font-normal
                        text-sm">{orderDetails.paymentStatus}</span>
                    </p>  
                    <div className='max-w-xs mt-5'>
                        <p className="font-montserrat w-fit text-slate-gray text-xs">
                            An {" "}
                            <span className="font-montserrat text-green-500 text-xs font-semibold my-1">
                            Email {" "}
                            </span>
                            will be sent to you, when payment is confirmed.
                        </p>                                             
                    </div> 
                    <div className="">
                        <p  className="font-montserrat 
                        text-purple-600 text-center hover:font-bold
                        text-md font-semibold">
                            <a href="/commission">
                            Back to commission
                            </a>
                        </p>
                    </div>                           
                </div>        
            </div>        
        </section>

    )
}

export default Order