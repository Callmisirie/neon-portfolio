import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Gift() {
    const [isClickedPaypal, setIsClickedPaypal] = useState(false);
    const [isClickedCrypto, setIsClickedCrypto] = useState(false);


    function handleClick(gift) {
        if (gift === "Paypal") { 
            if (isClickedPaypal) {
                setIsClickedPaypal(false);
            } else if (!isClickedPaypal) {
                setIsClickedPaypal(true);
                setIsClickedCrypto(false);
            }
        }
        else if (gift === "Crypto") {
            if (isClickedCrypto) {
                setIsClickedCrypto(false);
            } else if (!isClickedCrypto) {
                setIsClickedCrypto(true);
                setIsClickedPaypal(false);
            }
        } 
    }

    return (
        <section className="min-h-full flex flex-col items-center">
            <div className="flex 
            flex-col justify-center items-center  
            max-container m-10 rounded-lg 
            bg-white px-6 py-8 shadow-xl
            ring-slate-900/5"
            >   
                <h2  className="text-3xl leading-[68px] 
                lg:max-w-md font-montserrat  font-bold p-2 text-center">
                        Choose Gift
                </h2>
                <button 
                    className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:bg-purple-500 "
                    onClick={ ()=> {
                    handleClick("Paypal")
                }}>
                    Paypal
                </button>    
                <button
                    className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:bg-purple-500 " 
                    onClick={()=> {
                    handleClick("Crypto")
                }}>
                    Crypto
                </button>
                {isClickedPaypal && 
                    <>
                        <PaypalGift /> 
                    </> 
                }
                {isClickedCrypto && 
                    <>
                        <CryptoGift /> 
                    </> 
                }
            </div>  
        </section>

    );
};


const PaypalGift = () => {
    const [paypalGifts, setPaypalGifts] = useState([]);
    const [paypalGiftId, setPaypalGiftId] = useState(null)
  
    useEffect(() => {
        const fetchPaypalGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
                const {paypalGift} = response.data;
                setPaypalGifts(paypalGift)
            } catch (error) {
               console.error(error);
            }
        }
        fetchPaypalGift();
    }, [paypalGifts]);

    

    function handleChoosePaypalGift(id) {
      setPaypalGiftId(id === paypalGiftId ? null : id)
    }


    return (
        <section className="min-h-full">
            <div className="flex flex-col justify-center items-center rounded-lg 
            bg-white px-6 shadow-xl
            ring-slate-900/5">
                {paypalGifts && (
                    <>
                        <h2  className="text-3xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            Paypal Gift
                        </h2>
                        <ul className='flex flex-col mx-5 mb-5 mt-2.5'> 
                            {paypalGifts.map((paypalGift)=> {
                                return (
                                    <li key={paypalGift._id}>
                                        <p className="font-montserrat 
                                        text-slate-gray hover:text-black text-md
                                        leading-8 my-2 cursor-pointer w-full"
                                        onClick={()=> {handleChoosePaypalGift(paypalGift._id)}}>
                                            {paypalGift.address}
                                        </p>
                                        <ul className="flex flex-col my-2 rounded-lg 
                                        bg-white px-6">
                                            {paypalGiftId === paypalGift._id && 
                                                
                                                <li>
                                                    <p className="font-montserrat 
                                                    text-slate-gray hover:text-black text-sm
                                                    leading-8 my-2  w-full">
                                                        Username - {paypalGift.username}
                                                    </p>
                                                </li>
                                            }
                                        </ul>   
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )}
            </div>
        </section>
    );
}


const CryptoGift = () => {
    const [cryptoGifts, setCryptoGifts] = useState([]);
    const [cryptoGiftId, setCryptoGiftId] = useState(null)
  
    useEffect(() => {
        const fetchCryptoGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
            const {cryptoGift} = response.data;
                setCryptoGifts(cryptoGift)
            } catch (error) {
               console.error(error);
            }
        }
        fetchCryptoGift();
    }, [cryptoGifts]);

    

    function handleChooseCryptoGift(id) {
      setCryptoGiftId(id === cryptoGiftId ? null : id)
    }


    return (
        <section className="min-h-full">
            <div  className="flex sm:flex-row flex-col justify-center items-center rounded-lg 
            bg-white px-6 shadow-xl py-5
            ring-slate-900/5">
                <div  className="flex flex-col justify-center items-center
                bg-white mx-2 px-6 py-5 my-5">
                    <h2  className="text-3xl
                    lg:max-w-md font-palanquin 
                    font-bold p-2 text-center">
                        Crypto Gift
                    </h2>
                    <div className="flex flex-col mx-5 mt-5 w-full">
                    {cryptoGifts && cryptoGifts.map(cryptoGift => (
                        <p className="font-montserrat 
                        text-slate-gray hover:text-black 
                        text-md hover:font-semibold px-2
                        leading-8 my-2 cursor-pointer"
                        onClick={()=> {
                        handleChooseCryptoGift(cryptoGift._id)
                        }}>
                        {cryptoGift.cryptoName}
                        </p>
                    ))}
                    </div>
                </div>
                <ul className="flex flex-col justify-center items-center">
                    {cryptoGifts && cryptoGifts.map(cryptoGift => (
                    cryptoGift._id === cryptoGiftId && (
                        <li  className="flex justify-center 
                        items-center rounded-lg bg-white p-2 m-5 shadow-xl
                        ring-slate-900/5"
                        key={cryptoGift._id}>
                            <div  className="flex flex-col justify-center items-center  p-2">
                                <h3 className="font-montserrat 
                                text-slate-gray text-lg 
                                leading-8 my-2 text-center">
                                {cryptoGift.cryptoName}
                                </h3>
                                <p className="font-montserrat 
                                text-slate-gray text-md 
                                font-semibold my-1 text-center">
                                Network - <span className="font-montserrat 
                                text-slate-gray text-sm font-normal
                                my-1">
                                    {cryptoGift.network}
                                </span>
                                </p>
                                <img className="flex flex-col justify-center rounded-xl m-2 shadow-xl"
                                src={`http://localhost:4001/display/${cryptoGift._id}`} 
                                alt={`Manga ${cryptoGift.qrCodeImage}`} 
                                style={{ width: "222px" }}
                                />
                                <p className="font-montserrat 
                                text-slate-gray text-md 
                                leading-8 my-2 text-center">
                                    {cryptoGift.address}
                                </p>
                            </div>
                        </li>
                    )))}
                </ul>
            </div>           
        </section>
    );
}

export default Gift