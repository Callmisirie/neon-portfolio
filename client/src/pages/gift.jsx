import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { clipboardCopy } from '../assets/icons';
import bankTransferDetails from '../constants/bankTransferDetails';

function Gift() {
    const [isClickedPaypal, setIsClickedPaypal] = useState(false);
    const [isClickedCrypto, setIsClickedCrypto] = useState(false);
    const [isClickedBank, setIsClickedBank] = useState(false);
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
    }, [paypalGifts, cryptoGifts]);

    
    function handleClick(gift) {
        if (gift === "Paypal") { 
            if (isClickedPaypal) {
                setIsClickedPaypal(false);
            } else if (!isClickedPaypal) { 
                setIsClickedPaypal(true);
                setIsClickedCrypto(false);
                setIsClickedBank(false);
            }
        }
        else if (gift === "Crypto") {
            if (isClickedCrypto) {
                setIsClickedCrypto(false);
            } else if (!isClickedCrypto) {
                setIsClickedCrypto(true);
                setIsClickedPaypal(false);
                setIsClickedBank(false);
            }
        } 
        else if (gift === "Bank Transfer") {
            if (isClickedBank) {
                setIsClickedBank(false);
            } else if (!isClickedBank) {
                setIsClickedBank(true);
                setIsClickedPaypal(false);
                setIsClickedCrypto(false);
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
                <h2  className="text-3xl leading-[68px] mx-5
                lg:max-w-md font-montserrat font-bold p-2 text-center">
                        Choose Gift
                </h2>
                <div className='flex 
                flex-col justify-center items-center'>
                    {paypalGifts.length ? (
                        <button 
                            className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium my-3 mx-5
                            bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
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
                            bg-purple-600 rounded-md hover:shadow-md border-2 border-black" 
                            onClick={()=> {
                            handleClick("Crypto")
                        }}>
                            Crypto
                        </button>                    
                    ) : null}
                    <button
                        className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md hover:shadow-md border-2 border-black" 
                        onClick={()=> {
                        handleClick("Bank Transfer")
                    }}>
                        Bank Transfer
                    </button> 
                </div>


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
                {isClickedBank && 
                    <>
                        <BankGift />
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
    }, []);

    

    function handleChoosePaypalGift(id) {
      setPaypalGiftId(id === paypalGiftId ? null : id)
    }


    return (
        <section className="min-h-full">
                {paypalGifts?.length ? (
                    <>
                        <div className="flex flex-col 
                        justify-center items-center w-full 
                        bg-white p-5">
                            <h2  className="text-3xl 
                            lg:max-w-md font-palanquin 
                            font-bold p-2 text-center">
                                Paypal
                            </h2>
                            <ul className='flex flex-col mb-5'> 
                                {paypalGifts.map((paypalGift)=> {
                                    return (
                                        <li key={paypalGift._id}>
                                            <p className="font-montserrat text-center
                                            text-slate-gray hover:text-black text-md
                                            leading-8 my-2 cursor-pointer w-full hover:font-semibold"
                                            onClick={()=> {handleChoosePaypalGift(paypalGift._id)}}>
                                                {paypalGift.address}
                                            </p>
                                            <ul className="flex flex-col mt-2 rounded-lg 
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

                        </div>
                    </>
                ) : null}
        </section>
    );
}


const CryptoGift = () => {
    const [cryptoGifts, setCryptoGifts] = useState([]);
    const [cryptoGiftId, setCryptoGiftId] = useState(null);
    const [copyTooltip, setCopyTooltip] = useState("Copy");
  
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

    function handleCopyClipboard(address) {
        setCopyTooltip("Copied!");
        
        navigator.clipboard.writeText(address)
            .then(() => {
                console.log('Address copied to clipboard');
                setTimeout(() => {
                    setCopyTooltip("Copy");
                }, 2000);
            })
            .catch((error) => {
                console.error('Failed to copy address: ', error);
            });
    }

    return (
        <section className="min-h-full">
            {cryptoGifts?.length ? (        
                <div  className="flex sm:flex-row
                flex-col justify-center items-start 
                p-5">
                    <div  className="flex flex-col 
                    justify-center items-center">
                        <h2  className="text-xl mx-5
                        lg:max-w-md font-palanquin w-full
                        font-bold p-2 text-center">
                            Crypto
                        </h2>
                        <div className="flex flex-col mx-2 w-full">
                        {cryptoGifts && cryptoGifts.map(cryptoGift => (
                            <p className="font-montserrat text-start sm:text-center
                            text-slate-gray hover:text-black 
                            text-sm hover:font-semibold pl-10 pr-5 sm:px-5 
                            leading-8 mt-2 cursor-pointer"
                            onClick={()=> {
                            handleChooseCryptoGift(cryptoGift._id)
                            }}
                            key={cryptoGift._id}>
                            {cryptoGift.cryptoName}
                            </p>
                        ))}
                        </div>
                    </div>
                    <ul className="flex flex-col 
                    justify-center items-center rounded-lg 
                    shadow-xl">
                        {cryptoGifts && cryptoGifts.map(cryptoGift => (
                        cryptoGift._id === cryptoGiftId && (
                            <li  className="flex justify-center 
                            items-center"
                            key={cryptoGift._id}>
                                <div  className="flex flex-col px-5 pb-5
                                justify-center items-center">
                                    <h3 className="text-xl
                                    lg:max-w-md font-palanquin w-full
                                    font-semibold p-2 text-center">
                                    {cryptoGift.cryptoName}
                                    </h3>
                                    <p className="font-montserrat 
                                    text-slate-gray text-md font-semibold
                                    mt-5 text-center">
                                    Network - <span className="font-montserrat 
                                    text-slate-gray text-sm font-normal
                                    my-1">
                                        {cryptoGift.network}
                                    </span>
                                    </p>
                                    <img className="flex flex-col 
                                    justify-center rounded-xl my-5 shadow-xl"
                                    src={`http://localhost:4001/display/${cryptoGift._id}`} 
                                    alt={`Manga ${cryptoGift.qrCodeImage}`} 
                                    style={{ width: "220px" }}
                                    />
                                    <div className='flex justify-center items-center flex-col max-w-sm'>
                                        <h3 className="text-lg
                                        font-palanquin w-full
                                        font-semibold text-center">
                                            Address
                                        </h3>
                                        <p className="font-montserrat
                                        text-slate-gray text-xs 
                                        my-2">
                                            {cryptoGift.address?.slice(0,20)} <br/> {cryptoGift.address?.slice(20,cryptoGift.address.length)}
                                        </p>  
                                        <div className='flex 
                                        justify-center items-center 
                                        cursor-pointer m-1'
                                        onClick={() => handleCopyClipboard(cryptoGift.address)}>
                                            <img className="mx-2 
                                            rounded-full w-4 h-4 
                                            hover:h-8"
                                            src={clipboardCopy}
                                            alt="Copy to clipboard"
                                            /> 
                                            <p className="font-montserrat 
                                            text-slate-gray text-sm 
                                            leading-8 text-center">
                                                {copyTooltip}
                                            </p>                                                                    
                                        </div>                             
                                    </div>
                                </div>
                            </li>
                        )))}
                    </ul>
                </div>      
            ) : null}         
        </section>
    );
}

const BankGift = () => {
    const [bankGiftId, setBankGiftId] = useState(null)
    const [copyTooltip, setCopyTooltip] = useState("Copy");
    
    

    function handleChooseBankGift(id) {
        setBankGiftId(id === bankGiftId ? null : id)
    }
    
    function handleCopyClipboard(bankDetails) {
        setCopyTooltip("Copied!");
    
        const textToCopy =
            "Currency - " + bankDetails.currency + "\n" +
            "Account Holder - " + bankDetails.accountHolder + "\n" +
            "Account Number - " + bankDetails.accountNumber + "\n" +
            "Bank Name - " + bankDetails.bankName + "\n" +
            (bankDetails.achRouting ? "ACH Routing - " + bankDetails.achRouting + "\n" : "") +
            (bankDetails.swiftCode ? "Swift Code - " + bankDetails.swiftCode + "\n" : "") +
            (bankDetails.bankAddress ? "Bank Address - " + bankDetails.bankAddress + "\n" : "") +
            (bankDetails.accountType ? "Account Type - " + bankDetails.accountType + "\n" : "");
    
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('Bank details copied to clipboard');
                setTimeout(() => {
                    setCopyTooltip("Copy");
                }, 2000);
            })
            .catch((error) => {
                console.error('Failed to copy bank details: ', error);
            });
    }
    
    

    return (
        <section className="min-h-full">
                <div  className="flex sm:flex-row
                flex-col justify-center items-start 
                p-5">
                    <div  className="flex flex-col 
                    justify-center items-center">
                        <h2  className="text-xl mx-2
                        lg:max-w-md font-palanquin w-full
                        font-bold p-2 text-center">
                            Bank Transfer
                        </h2>
                        <div className="flex flex-col mx-5 w-full">
                        {bankTransferDetails.map(bankDetail => (
                            <p className="font-montserrat text-start sm:text-center
                            text-slate-gray hover:text-black 
                            text-sm hover:font-semibold px-5
                            leading-8 mt-2 cursor-pointer"
                            onClick={()=> {
                                handleChooseBankGift(bankDetail.currency) 
                            }}
                            key={bankDetail.currency}>
                                {bankDetail.currency}
                            </p>
                        ))}
                        </div>
                    </div>
                    <ul className="flex flex-col rounded-lg 
                    shadow-xl justify-center items-center">
                        {bankTransferDetails.map(bankDetail => (
                        bankDetail.currency === bankGiftId && (
                            <li  className=""
                            key={bankDetail.currency}>
                                <div  className="flex flex-col px-5 pb-5
                                justify-center">
                                    <div className='flex justify-between mt-5'>
                                        <p className="font-montserrat 
                                        text-slate-gray text-xs font-semibold
                                        ">
                                        Currency -  <span className="font-montserrat 
                                        text-slate-gray text-xs font-normal
                                        my-1">
                                            {bankDetail.currency}
                                        </span>
                                        </p> 
                                        <div className='flex 
                                        justify-center items-center 
                                        cursor-pointer'
                                        onClick={() => handleCopyClipboard(bankDetail)}>
                                            <img className="mx-2 
                                            rounded-full w-4 h-4 "
                                            src={clipboardCopy}/> 
                                            <p className="font-montserrat 
                                            text-slate-gray text-xs 
                                            text-center">
                                                {copyTooltip}
                                            </p>                                                                    
                                        </div>                                         
                                    </div>

                                    <p className="font-montserrat 
                                    text-slate-gray text-xs font-semibold
                                    mt-5">
                                    Account Holder -  <span className="font-montserrat 
                                    text-slate-gray text-xs font-normal
                                    my-1">
                                        {bankDetail.accountHolder}
                                    </span>
                                    </p>
                                    <p className="font-montserrat 
                                    text-slate-gray text-xs font-semibold
                                    mt-5">
                                    Account Number - <span className="font-montserrat 
                                    text-slate-gray text-xs font-normal
                                    my-1">
                                        {bankDetail.accountNumber}
                                    </span>
                                    </p>
                                    <p className="font-montserrat 
                                    text-slate-gray text-xs font-semibold
                                    mt-5">
                                    Bank Name - <span className="font-montserrat 
                                    text-slate-gray text-xs font-normal
                                    my-1">
                                        {bankDetail.bankName}
                                    </span>
                                    </p>
                                    {bankDetail?.achRouting && 
                                        <p className="font-montserrat 
                                        text-slate-gray text-xs font-semibold
                                        mt-5">
                                        ACH Routing -  <span className="font-montserrat 
                                        text-slate-gray text-xs font-normal
                                        my-1"> {bankDetail.achRouting}
                                        </span>
                                        </p>                                    
                                    }
                                    {bankDetail?.swiftCode && 
                                        <p className="font-montserrat 
                                        text-slate-gray text-xs font-semibold
                                        mt-5">
                                        Swift Code - <span className="font-montserrat 
                                        text-slate-gray text-xs font-normal
                                        my-1">
                                            {bankDetail.swiftCode}
                                        </span>
                                        </p>                                    
                                    }
                                    {bankDetail?.bankAddress && 
                                        <div className='max-w-sm'>
                                            <p className="font-montserrat w-fit
                                            text-slate-gray text-xs font-semibold
                                            mt-5">
                                            Bank Address - <span className="font-montserrat 
                                            text-slate-gray text-xs font-normal
                                            my-1">
                                                {bankDetail.bankAddress}
                                            </span>
                                            </p>                                             
                                        </div>
                                    }
                                    {bankDetail?.accountType && 
                                        <p className="font-montserrat 
                                        text-slate-gray text-xs font-semibold
                                        mt-5">
                                        Account Type - <span className="font-montserrat 
                                        text-slate-gray text-xs font-normal
                                        my-1">
                                            {bankDetail.accountType}
                                        </span>
                                        </p>                                    
                                    }
                                    {bankGiftId === "NGN" && 
                                        <div className='max-w-xs'>
                                            <p className="font-montserrat w-fit text-slate-gray text-xs mt-5">
                                            <a href='https://www.lemfi.com/' target="_blank" rel="noopener noreferrer">
                                                <span className="font-montserrat text-green-500 hover:text-green-600 text-xs font-semibold my-1">
                                                LemFi
                                                </span>
                                            </a>{' '}is recommended for gifts made to <span className='font-semibold'>NGN</span> by international clients.
                                            </p>                                             
                                        </div>
                                    }                                    
                                </div>
                            </li>
                        )))}
                    </ul>
                </div>        
        </section>
    );
}

export default Gift