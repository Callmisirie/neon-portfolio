import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clipboardCopy } from '../assets/icons';



function Payment() {
    const [isClickedPaypal, setIsClickedPaypal] = useState(false);
    const [isClickedCrypto, setIsClickedCrypto] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [transactionHistories, setTransactionHistories] = useState([]);
    const [resetMessage, setResetMessage] = useState(false); // Changed to state variable
    const [cryptoName, setCryptoName] = useState("");
    const navigate = useNavigate();

    const transactionDetails = JSON.parse(window.localStorage.getItem("transactionDetails"));
    const cryptoSymbolDetails = JSON.parse(window.localStorage.getItem("cryptoSymbolDetails"));

    const userID = window.localStorage.getItem("userID");

    
    const [paypalGifts, setPaypalGifts] = useState([]);
    const [cryptoGifts, setCryptoGifts] = useState([]);
    
    useEffect(() => {
        const fetchGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
                const {paypalGift, cryptoGift} = response.data;
            
                setPaypalGifts(paypalGift)
                setCryptoGifts(cryptoGift)
            } catch (error) {
               console.error(error);
            }
        }
        fetchGift();
    }, []);

    if (resetMessage) {
        setMessage("");
        setResetMessage(false);
    }

    function handleClick(gift) {
        if (gift === "Paypal") { 
            if (isClickedPaypal) {
                setIsClickedPaypal(false);
            } else if (!isClickedPaypal) {
                setIsClickedPaypal(true);
                setIsClickedCrypto(false);
                setPaymentMethod("Paypal");
                setCryptoName("");
                setIsChecked(false);
                setMessage("");
            }
        }
        else if (gift === "Crypto") {
            if (isClickedCrypto) {
                setIsClickedCrypto(false);
            } else if (!isClickedCrypto) {
                setIsClickedCrypto(true);
                setIsClickedPaypal(false);
                setPaymentMethod("Crypto")
                setIsChecked(false);
                setMessage("");
            }
        } 
    }

    const handlePayment = async () => {

       if (paymentMethod === "Crypto" && !cryptoName) {
            setMessage("Select a crypto currency before comfirming purchase");
            setMessageColor("red");
            return;
       }
        const transactionInfo = {
            paymentMethod, cryptoName,
            artStyle: transactionDetails.commissionDetails.artStyle,
            price: transactionDetails.price,
            quantity: transactionDetails.number,
            discount: transactionDetails.commissionDetails.discount,
            discountInterval: transactionDetails.commissionDetails.discountInterval,
            pricePer: transactionDetails.commissionDetails.pricePer,
            userID
        }
        try {
            const response = await axios.post("http://localhost:4001/manager/transactionHistory/create", transactionInfo)
            const {message, color} = response.data; 
            setMessage(message);
            setMessageColor(color);
            setIsChecked(false);
            // navigate("/commission");
            // window.scrollTo(0, 0);
        } catch (error) {
            setMessage("Error saving transaction");
            setMessageColor("red");
            setIsChecked(false);
            console.error(error)
        }
       
    }

    const toggle = () => {
        setIsChecked(!isChecked);
        setMessage("");
    }

    return (
        <section className="min-h-full flex flex-col items-center">
            <div className="flex flex-col sm:flex-row
            justify-center items-center flex-wrap
            max-container m-10 rounded-lg 
            bg-white px-6 py-8 shadow-xl
            ring-slate-900/5">
                <div className="flex 
                flex-col justify-center items-center  
                max-container m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">  
                    <h2  className="text-3xl leading-[68px] 
                    lg:max-w-md font-montserrat  font-bold p-2 text-center">
                            Choose Payment
                    </h2> 
                    {paypalGifts.length ? (
                        <button 
                            className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium my-3 mx-5
                            bg-purple-600 rounded-md hover:bg-purple-500 "
                            onClick={ ()=> {
                            handleClick("Paypal")
                        }}>
                            Paypal
                        </button>                        
                    ) : null}
                    {cryptoGifts.length ? (
                        <button
                            className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium my-3 mx-5
                            bg-purple-600 rounded-md hover:bg-purple-500 " 
                            onClick={()=> {
                            handleClick("Crypto")
                        }}>
                            Crypto
                        </button>                    
                    ) : null}

                    {isClickedPaypal && 
                        <>
                            <PaypalGift /> 
                        </> 
                    }
                    {isClickedCrypto && 
                        <>
                            <CryptoGift 
                            setResetMessage={setResetMessage}
                            cryptoName={cryptoName} 
                            setCryptoName={setCryptoName} /> 
                        </> 
                    }
                </div> 
                    {isClickedPaypal || isClickedCrypto ? (
                        <div className="flex gap-5
                        flex-col justify-center
                        max-container m-10 rounded-lg 
                        bg-white px-6 py-8 shadow-xl
                        ring-slate-900/5">
                            <h3 className="font-montserrat 
                              text-black font-semibold text-lg 
                               w-full text-center">
                                Transaction Details 
                            </h3>
                            <p className="font-montserrat font-semibold
                            text-slate-gray max-w-xs text-start
                            text-sm">
                                Art Style - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">{transactionDetails.commissionDetails.artStyle}</span>
                            </p>
                            <p className="font-montserrat font-semibold
                            text-slate-gray max-w-xs text-start
                            text-sm">
                                Quantity - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">{transactionDetails.number}</span>
                            </p>
                            <p className="font-montserrat font-semibold
                            text-slate-gray max-w-xs text-start
                            text-sm">
                                Price - <span className="font-montserrat 
                                text-green-600 text-start font-normal
                                text-sm">${transactionDetails.price}</span>
                               
                            </p>
                            {cryptoName && (cryptoSymbolDetails && cryptoSymbolDetails.map((cryptoSymbolDetail)=> {
                                return (cryptoName === cryptoSymbolDetail.symbol ? (
                                    <p className="font-montserrat font-semibold
                                    text-slate-gray max-w-xs text-start
                                    text-sm"
                                    key={cryptoSymbolDetail.symbol}>
                                        Price in {cryptoSymbolDetail.symbol}  - <span className="font-montserrat 
                                        text-slate-gray text-start font-normal
                                        text-sm">{transactionDetails.price / cryptoSymbolDetail.price}</span>   
                                    
                                    </p>                                               
                                    ) : null)
                            }))}
                            <p className="font-montserrat font-semibold
                            text-slate-gray max-w-xs text-start
                            text-sm">
                                Discount - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">{`${transactionDetails.commissionDetails.discount}%
                                per ${transactionDetails.commissionDetails.discountInterval} 
                                ${transactionDetails.commissionDetails.pricePer}${transactionDetails.number > (1) ? "s" : ""}`}</span>   
                            </p>
                            <p className="font-montserrat font-semibold
                            text-slate-gray max-w-xs text-start
                            text-sm">
                                Payment Method - <span className="font-montserrat 
                                text-slate-gray text-start font-normal
                                text-sm">{paymentMethod}</span>
                            </p>
                            {cryptoName && (
                                <p className="font-montserrat font-semibold
                                text-slate-gray max-w-xs text-start
                                text-sm">
                                    Crypto - <span className="font-montserrat 
                                    text-slate-gray text-start font-normal
                                    text-sm">{cryptoName}</span>
                                </p>                                
                            )}
                            
                            <div className="flex flex-col justify-center items-center mt-5 p-2">
                                <div className="flex justify-center items-center m-2 p-2">                      
                                    <label htmlFor="toggle" className="flex items-center cursor-pointer m-2">
                                        <div className="flex items-center">
                                            <input
                                                id="toggle"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={isChecked}
                                                onChange={toggle}
                                            />
                                            <div className="w-12 h-4 border  rounded-full"></div>
                                            <div className={`dot absolute w-6 h-6 ${isChecked ? 
                                            'bg-green-600' : 'bg-slate-gray'} rounded-full shadow 
                                            ${isChecked ? 'translate-x-full' : ''} transition`}></div>
                                        </div>
                                    </label>
                                    <p  className="font-montserrat 
                                    text-slate-gray max-w-xs text-start
                                    text-sm">
                                        I hereby acknowledge that payment 
                                        has been made for this purchase.
                                    </p>
                                </div>
                                <button className={`px-4 py-2 my-2 border rounded-full text-white w-fit
                                font-montserrat text-xs leading-none bg-green-600 border-green-600 
                                hover:bg-green-500 hover:border-green-500
                                ${isChecked ? `opacity-100` : `opacity-75 cursor-not-allowed`}`}
                                onClick={() => {
                                handlePayment()
                                }}
                                disabled={!isChecked}>
                                    Confirm Payment
                                </button>
                                {message && <p className="font-montserrat max-w-xs text-center
                                text-sm my-2"  style={{ color:`${messageColor}`}}>
                                    {message}
                                </p>}
                            </div>
                            
                           
                        </div> 
                    ): null}
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
    }, []);

    

    function handleChoosePaypalGift(id) {
      setPaypalGiftId(id === paypalGiftId ? null : id)
    }


    return (
        <section className="min-h-full">
            <div className="flex flex-col 
            justify-center items-center 
            bg-white p-5">
                {paypalGifts && (
                    <>
                        <h2  className="text-3xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            Paypal
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


const CryptoGift = ({ setResetMessage, cryptoName, setCryptoName }) => {
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
    }, []);

    

    function handleChooseCryptoGift(id) {
        setCryptoGiftId(id === cryptoGiftId ? null : id)
        setResetMessage(true);
    }

    
    function handleCopyClipboard(address) {
        navigator.clipboard.writeText(address)
            .then(() => {
                console.log('Address copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy address: ', error);
            });
    }


    return (
        <section className="min-h-full">
            <div  className="flex sm:flex-row 
            flex-col justify-center items-center 
            p-5">
                <div  className="flex flex-col 
                justify-center items-center">
                    <h2  className="text-3xl
                    lg:max-w-md font-palanquin 
                    font-bold p-2 text-center">
                        Crypto
                    </h2>
                    <div className="flex flex-col mx-5 mt-5 w-full">
                    {cryptoGifts && cryptoGifts.map(cryptoGift => (
                        <p className="font-montserrat 
                        text-slate-gray hover:text-black 
                        text-md hover:font-semibold px-2
                        leading-8 my-2 cursor-pointer"
                        onClick={()=> {
                        handleChooseCryptoGift(cryptoGift._id)
                        setCryptoName(cryptoName === cryptoGift.cryptoName ? null : cryptoGift.cryptoName) 
                        }}
                        key={cryptoGift._id}>
                            {cryptoGift.cryptoName}
                        </p>
                    ))}
                    </div>
                </div>
                <ul className="flex flex-col 
                justify-center items-center">
                    {cryptoGifts && cryptoGifts.map(cryptoGift => (
                    cryptoGift._id === cryptoGiftId && (
                        <li  className="flex justify-center items-center 
                        p-2 m-5"
                        key={cryptoGift._id}>
                            <div  className="flex flex-col 
                            justify-center items-center p-2">
                                <h3 className="font-montserrat 
                                text-slate-gray text-lg 
                                leading-8 my-2 text-center">
                                {cryptoGift.cryptoName}
                                </h3>
                                <p className="font-montserrat 
                                text-slate-gray text-md font-semibold
                                my-1 text-center">
                                Network - <span className="font-montserrat 
                                text-slate-gray text-sm font-normal
                                my-1">
                                    {cryptoGift.network}
                                </span>
                                </p>
                                <img className="flex flex-col 
                                justify-center rounded-xl m-2 shadow-xl"
                                src={`http://localhost:4001/display/${cryptoGift._id}`} 
                                alt={`Manga ${cryptoGift.qrCodeImage}`} 
                                style={{ width: "222px" }}
                                />
                                <div className='flex items-center p-2 w-full'>
                                    <p className="font-montserrat 
                                    text-slate-gray text-md 
                                    leading-8 my-2 text-center">
                                        {cryptoGift.address}
                                    </p>  
                                    <img className="mx-2 
                                    rounded-full w-4 h-4 
                                    hover:h-8 cursor-pointer"
                                    onClick={() => handleCopyClipboard(cryptoGift.address)}
                                    src={clipboardCopy}/>                               
                                </div>
                            </div>
                        </li>
                    )))}
                </ul>
            </div>           
        </section>
    );
}

export default Payment;