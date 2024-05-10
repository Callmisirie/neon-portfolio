import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import NumberOfOrders, { handleTransactionDetails } from "../components/NumberOfOrders";
import ReviewSection from "../components/ReviewSection.jsx";
import CommissionImagePopup from "../components/commissionImagePopup.jsx";


const Commission = () => {
  const [commissions, setCommissions] = useState([]);
  const [cryptoGifts, setCryptoGifts] = useState([]);
  const [commissionID, setCommissionID] = useState(null);
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [selectedTransactionHistoriesIndices, setSelectedTransactionHistoriesIndices] = useState([]);
  const [clickedTransactionHistoryId, setClickedTransactionHistoryId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [userCookies, setUserCookies] = useCookies(["userAccess_token"]);
  const navigate = useNavigate();
  const userID = window.localStorage.getItem("userID");
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setIsChecked(!isChecked);
    setMessage("");
  }

  
  useEffect(() => {
    const fetchCommission = async () =>{
      try {
        const commissionResponse = await axios.get("http://localhost:4001/manager/commission/read") 
        setCommissions(commissionResponse.data)

        const cryptoGiftResponse = await axios.get("http://localhost:4001/manager/gift/read") 
        setCryptoGifts(cryptoGiftResponse.data.cryptoGift)
      } catch (error) {
        console.error(error);
      }
    }
    fetchCommission();
  }, [cryptoGifts]);

  useEffect(() => {
    const fetchTransactionHistory = async () =>{
      try {
        const transactionHistoryResponse = await axios.get("http://localhost:4001/manager/transactionHistory/read", {
          params: { userID }
        });

        setTransactionHistories(transactionHistoryResponse.data.userTransactionHistory)
        let indices = [];

        if (transactionHistories && transactionHistories.transactionDetails) {
          if (transactionHistories.transactionDetails.length > 0) {
            if (transactionHistories.transactionDetails.length > 3) {
              indices = Array.from(Array(transactionHistories.transactionDetails.length).keys()).slice((transactionHistories.transactionDetails.length - 3),transactionHistories.transactionDetails.length);          
            } else {
              indices = Array.from(Array(transactionHistories.transactionDetails.length).keys());
            }
          }
          setSelectedTransactionHistoriesIndices(indices);
        }
        
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransactionHistory();
}, [transactionHistories]);


  function handleChooseArtStyle(id) {
    setCommissionID(id === commissionID ? null : id);
    setIsChecked(false);
    setMessage("");
  }

  const handlePayment = async () => {

    let cryptoSymbols = [];
    let cryptoSymbolDetails;
    let currencyDetails;
  

    if (cryptoGifts.length) {
      cryptoGifts.map(cryptoGift => cryptoSymbols.push(cryptoGift.cryptoName))
    }
    
    if (!userID) {
      setMessage("Log in before making purchase.");
      setMessageColor("red")
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } else if (userID) {
      try {
        const cryptoLatestResponse = await axios.get("http://localhost:4001/cryptocurrency/latest", {
          params: { cryptoSymbols }
        });

        cryptoSymbolDetails = cryptoLatestResponse.data;

        const currencyLatestResponse = await axios.get("http://localhost:4001/currency/latest");

        currencyDetails = currencyLatestResponse.data;
       
        window.localStorage.removeItem("cryptoSymbolDetails");
        window.localStorage.setItem("cryptoSymbolDetails", JSON.stringify(cryptoSymbolDetails));
        window.localStorage.removeItem("currencyDetails");
        window.localStorage.setItem("currencyDetails", JSON.stringify(currencyDetails));
        handleTransactionDetails()
        navigate("/payment");
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleTransactionHistoryClick = (id) => {
    setClickedTransactionHistoryId(id === clickedTransactionHistoryId ? null : id);
  }


  return (
    <section className="min-h-full">
      {commissions?.length ? (
        <div className=" flex 
        lex-wrap justify-center 
        items-center rounded-lg 
        bg-white px-6">
          <div  className="flex sm:flex-row flex-col justify-center items-start rounded-lg my-20 
            bg-white px-6 shadow-xl py-5
            ring-slate-900/5">
            <div  className="flex flex-col justify-center items-center
            bg-white mx-2 px-6">
              <h3 className="text-4xl leading-[68px] 
              lg:max-w-md font-palanquin font-bold p-2 mt-5 text-center">
                Choose Art Style
              </h3>
              <div className="flex flex-col 
              justify-center items-start
              bg-white p-4 w-full">
                {commissions.map(commission => (
                  <p className="font-montserrat 
                  text-slate-gray hover:text-black 
                  text-md hover:font-semibold
                  leading-8 my-2 cursor-pointer"
                  key={commission._id}
                  onClick={()=> {
                    handleChooseArtStyle(commission._id)
                  }}>
                    {commission.artStyle}
                  </p>
                ))}
              </div>
            </div>
            {commissionID ? (
              <div className="flex flex-col justify-center items-center">
                <ul className="flex flex-col justify-center items-center">
                  {commissions?.map(commission => (
                    commission?._id === commissionID ? (
                      <li  className="flex justify-center items-center rounded-lg 
                      bg-white p-2 m-5 shadow-xl
                      ring-slate-900/5"
                      key={commission._id}>
                        <div  className="flex flex-col justify-center items-center p-2">
                          <h3 className="font-montserrat 
                          text-slate-gray text-lg 
                          leading-8 mt-2 w-full text-center">
                            {commission.artStyle}
                          </h3>
                          <img className="flex
                          flex-col justify-center rounded-xl 
                          my-5 border cursor-pointer"
                            src={`http://localhost:4001/display/${commission._id}`} 
                            alt={`Manga ${commission.artImage}`} 
                            style={{ width: "120px" }}
                            onClick={() => setOpen(true)}
                          />
                          <NumberOfOrders commission={commission}/>
                          <CommissionImagePopup 
                          open={open} 
                          onClose={() => setOpen(false)}
                          commission={commission}
                          />

                        </div> 
                      </li>
                    ) : null
                  ))}
                </ul>
                <p className="font-montserrat text-purple-600 text-start text-sm font-semibold hover:font-bold">
                  <a href="/contact" target="_blank" rel="noopener noreferrer">
                      Contact
                  </a> <span className="font-montserrat 
                  text-slate-gray text-start font-normal text-xs">NEON.</span>
                </p>

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
                      I hereby acknowledge that i have contacted 
                      NEON for commission details before making purchase.
                  </p>
                </div>
                <button className={`px-4 py-2 my-2 border rounded-md text-white
                font-montserrat text-md leading-none mb-5 bg-green-500 border-green-500 
                hover:bg-green-600 hover:border-green-600
                ${isChecked ? `opacity-100` : `opacity-75 cursor-not-allowed`}`}
                onClick={() => {
                  handlePayment()
                }}
                disabled={!isChecked}>
                    Purchase
                </button>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2"  style={{ color:`${messageColor}`}}>
                  {message}
                </p>}
              </div>
            ) : null}
          </div>           
        </div>        
      ) : null}
        {userID && (
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
                  {transactionHistories && transactionHistories.transactionDetails ? transactionHistories.transactionDetails.map((transactionDetail, index)=> {
                    return (
                     selectedTransactionHistoriesIndices.includes(index) ? (
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
                          mb-5 rounded-lg bg-white px-3
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
                      ): null
                    )
                  }) : null}
                </ul>
                <div className="mb-5">
                  <p  className="font-montserrat 
                  text-purple-600 text-center hover:font-bold
                  text-md font-semibold">
                    <a href="/commission/transactionHistory">
                      Show all...
                    </a>
                  </p>
                </div>                    
              </div>              
            </section>
          </section>              
        )}
        <ReviewSection />
      </section> 
    );
}

export default Commission;