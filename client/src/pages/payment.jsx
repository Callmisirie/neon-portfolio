import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clipboardCopy } from '../assets/icons';
import bankTransferDetails from '../constants/bankTransferDetails';



function Payment() {
    const [isClickedPaypal, setIsClickedPaypal] = useState(false);
    const [isClickedCrypto, setIsClickedCrypto] = useState(false);
    const [isClickedBank, setIsClickedBank] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [transactionHistories, setTransactionHistories] = useState([]);
    const [resetMessage, setResetMessage] = useState(false); // Changed to state variable
    const [cryptoName, setCryptoName] = useState("");
    const [bankCurrency, setBankCurrency] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(10);
    const navigate = useNavigate();
    const [priceInCrypto, setPriceInCrypto] = useState(null);
    const [priceInCurrency, setPriceInCurrency] = useState(null);
    const [copyTooltip, setCopyTooltip] = useState("Copy");
    const transactionDetails = JSON.parse(window.localStorage.getItem("transactionDetails"));
    const [cryptoSymbolDetails, setCryptoSymbolDetails] = useState(JSON.parse(window.localStorage.getItem("cryptoSymbolDetails")));
    const currencyDetails = JSON.parse(window.localStorage.getItem("currencyDetails"));
    const userID = window.localStorage.getItem("userID");
    const [paypalGifts, setPaypalGifts] = useState([]);
    const [cryptoGifts, setCryptoGifts] = useState([]);
    
    useEffect(() => {
        const fetchGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
                const {paypalGift, cryptoGift} = response.data;
    
                setPaypalGifts(paypalGift);
                setCryptoGifts(cryptoGift);
            } catch (error) {
                console.error(error);
            }
        }
    
        fetchGift();
    }, []);

    useEffect(() => {
        let cryptoSymbols = [];
    
        if (cryptoGifts.length) {
          cryptoGifts.map(cryptoGift => cryptoSymbols.push(cryptoGift.cryptoName))
        }
        
        const interval = setInterval( async () => {
            if (seconds === 0) {
                if (minutes === 0) {
                    setMinutes(10)
                    try {
                        const transactionHistoryResponse = await axios.get("http://localhost:4001/cryptocurrency/latest", {
                            params: { cryptoSymbols }
                        });
                        const cryptoSymbolDetails = transactionHistoryResponse.data;  
                        setCryptoSymbolDetails(cryptoSymbolDetails)                 
                    } catch (error) {
                        console.error(error)
                    }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds(seconds - 1);
            }
        }, 1000);
    
        return () => clearInterval(interval); // Clean up the interval when the component unmounts
    }, [seconds, minutes]);
    
    

    if (resetMessage) {
        setMessage("");
        setResetMessage(false);
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function handleClick(gift) {
        if (gift === "Paypal") { 
            if (isClickedPaypal) {
                setIsClickedPaypal(false);
            } else if (!isClickedPaypal) {
                setIsClickedPaypal(true);
                setIsClickedCrypto(false);
                setIsClickedBank(false);
                setPaymentMethod("Paypal");
                setCryptoName("");
                setBankCurrency("");
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
                setIsClickedBank(false);
                setPaymentMethod("Crypto")
                setBankCurrency("");
                setIsChecked(false);
                setMessage("");
            }
        } 
        else if (gift === "Bank Transfer") {
            if (isClickedBank) {
                setIsClickedBank(false);
            } else if (!isClickedBank) {
                setIsClickedBank(true);
                setIsClickedPaypal(false);
                setIsClickedCrypto(false);
                setPaymentMethod("Bank Transfer");
                setCryptoName("");
                setIsChecked(false);
                setMessage("");
            }
        } 
    }



    const handlePayment = async () => {


        console.log(bankCurrency);
       if (paymentMethod === "Crypto" && !cryptoName) {
            setMessage("Select a crypto currency before confirming purchase");
            setMessageColor("red");
            return;
       } else if (paymentMethod === "Bank Transfer" && !bankCurrency) {
            setMessage("Select a currency before confirming purchase");
            setMessageColor("red");
        return;
       }
        const transactionInfo = {
            paymentMethod, cryptoName, priceInCrypto, bankCurrency, priceInCurrency,
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
            setTimeout(() => {
                navigate("/commission");
            }, 5000);
        } catch (error) {
            setMessage("Error saving transaction");
            setMessageColor("red");
            setTimeout(() => {
                setMessage("");
            }, 5000);
            setIsChecked(false);
            console.error(error)
        }
       
    }

    const toggle = () => {
        setIsChecked(!isChecked);
        setMessage("");
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
        <section className="min-h-full flex flex-col items-center">
            {paypalGifts.length || cryptoGifts.length ? (        
                <div className="flex flex-col sm:flex-row
                justify-center items-start flex-wrap
                max-container m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">
                    <div className="flex 
                    flex-col justify-center items-center  
                    max-container m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5">  
                        <h2  className="text-3xl leading-[68px] 
                        lg:max-w-md font-montserrat font-bold p-2 text-center">
                                Choose Payment
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
                                <CryptoGift 
                                setResetMessage={setResetMessage}
                                cryptoName={cryptoName} 
                                setCryptoName={setCryptoName}
                                cryptoSymbolDetails={cryptoSymbolDetails}
                                price={transactionDetails.price}
                                setPriceInCrypto={setPriceInCrypto} /> 
                            </> 
                        }
                        {isClickedBank && 
                            <>
                                <BankGift 
                                setResetMessage={setResetMessage}
                                setBankCurrency={setBankCurrency}
                                bankCurrency={bankCurrency}
                                price={transactionDetails.price}
                                currencyDetails={currencyDetails}
                                setPriceInCurrency={setPriceInCurrency}
                                />
                            </>                        
                        }

                        
                    </div>                


                        {isClickedPaypal || isClickedCrypto || isClickedBank ? (
                            <div className="flex gap-5
                            flex-col justify-center
                            max-container m-10 rounded-lg 
                            bg-white px-6 py-8 shadow-xl
                            ring-slate-900/5">
                                <h3 className="text-3xl leading-[68px] 
                                g:max-w-md font-montserrat font-bold p-2 text-center">
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
                                        <div className='flex items-center max-w-fit'
                                        key={cryptoSymbolDetail.symbol}>
                                            <p className="font-montserrat font-semibold
                                            text-slate-gray text-start
                                            text-sm">
                                                Price in {cryptoSymbolDetail.symbol}  - <span className="font-montserrat 
                                                text-slate-gray text-start font-normal
                                                text-sm">{priceInCrypto}</span>       
                                            </p>
                                            <div className='flex
                                            justify-center items-center 
                                            cursor-pointer ml-10'
                                            onClick={() => handleCopyClipboard(priceInCrypto)}>
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
                                                    
                                        ) : null)
                                }))}
                                {bankCurrency === currencyDetails.currency ? (
                                    <div className='flex items-center max-w-fit'>
                                        <p className="font-montserrat font-semibold
                                        text-slate-gray text-start
                                        text-sm">
                                            Price in {currencyDetails.currency}  - <span className="font-montserrat 
                                            text-slate-gray text-start font-normal
                                            text-sm">&#x20A6;{priceInCurrency}</span>       
                                        </p>
                                        <div className='flex
                                        justify-center items-center 
                                        cursor-pointer ml-10'
                                        onClick={() => handleCopyClipboard(priceInCurrency)}>
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
                                    text-sm">{`${transactionDetails.commissionDetails.discount}%
                                    applies to every ${transactionDetails.commissionDetails.discountInterval} 
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
                                                    onChange={() => {
                                                        toggle() 
                                                    }}
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
                                    <button className={`px-4 py-2 
                                    my-2 border rounded-full text-black w-fit
                                    font-montserrat text-xs leading-none bg-green-500 
                                    hover:bg-green-600 border-black
                                    ${isChecked ? `opacity-100` : `opacity-85 cursor-not-allowed`}`}
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
                                {cryptoName && (
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='font-montserrat leading-8
                                        text-xs font-semibold text-slate-gray
                                        text-center'>
                                            Crypto price reqoute
                                        </p>
                                        <p className={`font-montserrat leading-8
                                        text-md font-semibold 
                                        text-center ${minutes < 4 ? `text-red-500` : `text-black`}`}>
                                                {pad(minutes)}:{pad(seconds)}
                                        </p>
                                        
                                    </div>                                  
                                )}

                            </div> 
                        ): null}
                </div>
            ) : null}
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
                    justify-center items-center 
                    bg-white p-5">
                        <h2  className="text-xl 
                        lg:max-w-md font-palanquin
                        font-bold p-2 text-center">
                            Paypal
                        </h2>
                        <ul className='flex flex-col mx-5 mb-5'> 
                            {paypalGifts.map((paypalGift)=> {
                                return (
                                    <li key={paypalGift._id}>
                                        <p className="font-montserrat text-center
                                        text-slate-gray hover:text-black text-md
                                        leading-8 mt-2 cursor-pointer w-full hover:font-semibold"
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


const CryptoGift = ({ setResetMessage, cryptoName, setCryptoName, cryptoSymbolDetails, price, setPriceInCrypto }) => {
    const [cryptoGifts, setCryptoGifts] = useState([]);
    const [cryptoGiftId, setCryptoGiftId] = useState(null)
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
    }, []);

    function handleChooseCryptoGift(id) {
        setCryptoGiftId(id === cryptoGiftId ? null : id)
        setResetMessage(true);
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
                            setCryptoName(cryptoName === cryptoGift.cryptoName ? null : cryptoGift.cryptoName) 
                            const selectedCrypto = cryptoSymbolDetails.filter(cryptoSymbolDetail => cryptoSymbolDetail.symbol.includes(cryptoGift.cryptoName))
                            selectedCrypto.map((crypto)=> {                            
                                const decimalCount = (( price / crypto.price).toString().split('.')[1] || '').length;
                                if (decimalCount < 6) {
                                setPriceInCrypto((price / crypto.price).toFixed(2))
                                } else {
                                    setPriceInCrypto((price / crypto.price).toFixed(6))
                                }     
                            })
                            }}
                            key={cryptoGift._id}>
                                {cryptoGift.cryptoName}
                            </p>
                        ))}
                        </div>
                    </div>
                    <ul className="flex flex-col 
                    justify-center items-center rounded-lg 
                    shadow-xl ">
                        {cryptoGifts && cryptoGifts.map(cryptoGift => (
                        cryptoGift._id === cryptoGiftId && (
                            <li  className="flex justify-center items-center"
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
                                    style={{ width: "222px" }}
                                    />
                                    <div className='max-w-sm'>
                                        <p className="font-montserrat
                                        text-slate-gray text-xs 
                                        my-2">
                                            {cryptoGift.address}
                                        </p>  
                                        <div className='flex 
                                        justify-center items-center 
                                        cursor-pointer m-1'
                                        onClick={() => handleCopyClipboard(cryptoGift.address)}>
                                            <img className="mx-2 
                                            rounded-full w-4 h-4 
                                            hover:h-8"
                                            src={clipboardCopy}/> 
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

const BankGift = ({bankCurrency, setBankCurrency, setResetMessage, price, currencyDetails, setPriceInCurrency}) => {
    const [bankGifts, setBankGifts] = useState([]);
    const [bankGiftId, setBankGiftId] = useState(null)
    const [copyTooltip, setCopyTooltip] = useState("Copy");
    
    

    function handleChooseBankGift(id) {
        setBankGiftId(id === bankGiftId ? null : id)
        setResetMessage(true);
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
                                setBankCurrency(bankCurrency === bankDetail.currency ? null : bankDetail.currency);
                                bankDetail.currency === currencyDetails.currency ? setPriceInCurrency(( currencyDetails.rate * price ).toFixed(2)) : null ;                       
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
                                            rounded-full w-4 h-4 
                                            "
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
                                            </a>{' '}is recommended for Payments made to <span className='font-semibold'>NGN</span> by international clients.
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

export default Payment;