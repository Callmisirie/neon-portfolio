import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////



function GiftManager() {
    const navigate = useNavigate();

    function handleCreate() {
        navigate("/manager/gift/create")
        window.scrollTo(0, 0);
    };

    function handleDelete() {
        navigate("/manager/gift/delete")
        window.scrollTo(0, 0);
    };

    function handleEdit() {
        navigate("/manager/gift/edit")
        window.scrollTo(0, 0);
    };

  return (
    <section className="min-h-full flex flex-col items-center">
        <h2  className="text-3xl leading-[68px] 
        lg:max-w-md font-montserrat  font-bold p-2 text-center">
            GIFT MANAGER
        </h2>
        <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
        bg-white px-6 py-4 shadow-xl
        ring-slate-900/5">
            <div className="flex flex-col justify-center items-center m-10 rounded-lg 
            bg-white px-10 py-8 shadow-xl
            ring-slate-900/5">
                <button className="text-white px-4 py-2 text-sm
                font-montserrat font-medium my-3 mx-1 w-full
                bg-purple-600 rounded-md hover:bg-purple-500"
                onClick={handleCreate}> 
                    Create
                </button>
                <button className="text-white px-4 py-2 text-sm
                font-montserrat font-medium my-3 mx-1 w-full
                bg-purple-500 rounded-md hover:bg-purple-400 "
                onClick={handleDelete}> 
                    Delete
                </button>
                <button className="text-white px-4 py-2 text-sm
                font-montserrat font-medium my-3 mx-1 w-full
                bg-purple-500 rounded-md hover:bg-purple-400 "
                onClick={handleEdit}> 
                    Edit
                </button>
            </div>
        </div>
    </section>
  )  
};


//////////////////////////////////////////////////////////////////////////CREATE GIFT//////////////////////////////////////////////////////////////////////////



function GiftCreate() {
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
                        <PaypalGiftCreate /> 
                    </> 
                }
                {isClickedCrypto && 
                    <>
                        <CryptoGiftCreate /> 
                    </> 
                }
            </div>  
        </section>

    );
};



function PaypalGiftCreate() {
    const isClickedPaypal = true;
    const [paypalGifts, setPaypalGifts] = useState([]);
    const [address, setAddress] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Upload Paypal Gift");



useEffect(() => {
    const fetchPaypalGift = async () =>{
        try {
            const response = await axios.get("http://localhost:4001/manager/gift/read") 
            const {paypalGift} = response.data
            setPaypalGifts(paypalGift)
        } catch (error) {
            console.error(error);
        }
    }

    fetchPaypalGift();
}, []);



const handleSubmit = async (e) => {
    e.preventDefault();

    setActionMessage("Processing...")
    const formData = new FormData();
    formData.append("address", address);
    formData.append("username", username);
    formData.append("isClickedPaypal", isClickedPaypal);



    try {
        await axios.post("http://localhost:4001/manager/gift/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Paypal Gift uploaded successfully");
        setAddress("");
        setUsername("");
        setActionMessage("Upload Paypal Gift")
        setMessageColor("green");
    } catch (error) {
        setMessage("Error uploading Paypal Gift");
        setAddress("");
        setUsername("");
        setActionMessage("Upload Paypal Gift")
        setMessageColor("red");
        console.error(error);
    }
};


return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
        <div className="flex flex-col justify-center items-center mb-5"> 
            <h2 className="text-3xl leading-[68px] 
            lg:max-w-md font-palanquin font-bold p-2">
                Create Paypal Gift
            </h2>
            {message && <p className="font-montserrat text-lg 
            leading-8 my-2"
            style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5"
            onSubmit={handleSubmit}>   
                <Input type="email" 
                value={address} handleChange={setAddress} 
                resetMessage={setMessage} 
                placeholder="Address" />
                <Input type="text" 
                value={username} handleChange={setUsername} 
                resetMessage={setMessage} 
                placeholder="Username"/>
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                type="submit">
                    {actionMessage}
                </button>
            </form>
        </div> 
    </div>
);
};


function CryptoGiftCreate() {
    const isClickedCrypto = true;
    const [cryptoGifts, setCryptoGifts] = useState([]);
    const [cryptoName, setCryptoName] = useState("");
    const [address, setAddress] = useState("");
    const [network, setNetwork] = useState("");
    const [qrCodeImage, setQrCodeImage] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Upload Crypto Gift");
    const fileInputRef = useRef(null);



useEffect(() => {
    const fetchCrptoGift = async () =>{
        try {
            const response = await axios.get("http://localhost:4001/manager/gift/read") 
            const {cryptoGift} = response.data
            setCryptoGifts(cryptoGift)
        } catch (error) {
            console.error(error);
        }
    }

    fetchCrptoGift();
}, []);


const handleFileChange = (e) => {
    const files = e.target.files;
    setQrCodeImage(...files);
    setMessage("");
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setActionMessage("Processing...")
    const formData = new FormData();
    formData.append("cryptoName", cryptoName);
    formData.append("address", address);
    formData.append("network", network);
    formData.append("qrCodeImage", qrCodeImage);
    formData.append("isClickedCrypto", isClickedCrypto);


    try {
        await axios.post("http://localhost:4001/manager/gift/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Crypto Gift uploaded successfully");
        setCryptoName("");
        setAddress("");
        setNetwork("");
        setQrCodeImage("");
        setActionMessage("Upload Crypto Gift");
        setMessageColor("green");
        fileInputRef.current.value = null;
    
        
    } catch (error) {
        setMessage("Error uploading Crypto Gift");
        setCryptoName("");
        setAddress("");
        setNetwork("");
        setQrCodeImage("");
        setActionMessage("Upload Crypto Gift");
        setMessageColor("red");
        fileInputRef.current.value = null;
        console.error(error);
    }
};


return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
        <div className="flex flex-col justify-center items-center mb-5"> 
            <h2 className="text-3xl leading-[68px] 
            lg:max-w-md font-palanquin font-bold p-2">
                Create Crypto Gift
            </h2>
            {message && <p className="font-montserrat text-lg 
            leading-8 my-2"
            style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5"
            onSubmit={handleSubmit}>   
                <Input type="text" 
                value={cryptoName} handleChange={setCryptoName} 
                resetMessage={setMessage} 
                placeholder="Crypto Name" />
                <Input type="text" 
                value={address} handleChange={setAddress} 
                resetMessage={setMessage} 
                placeholder="Address"/>
                <Input type="text" 
                value={network} handleChange={setNetwork} 
                resetMessage={setMessage} 
                placeholder="Network"/>
                <div className='flex flex-col items-center'>
                    <label className="flex flex-col items-center font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-4 text-center">
                        <p className='mb-4 font-bold'>Select QR Code</p>
                        <input  className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100'
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileChange}/>
                    </label>
                </div>
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                type="submit">
                    {actionMessage}
                </button>
            </form>
        </div> 
    </div>
)};

//////////////////////////////////////////////////////////////////////////DELETE COMMISSION//////////////////////////////////////////////////////////////////////////


function GiftDelete() {
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
                        <PaypalGiftDelete /> 
                    </> 
                }
                {isClickedCrypto && 
                    <>
                        <CryptoGiftDelete /> 
                    </> 
                }
            </div>  
        </section>

    );
};


function PaypalGiftDelete() {
    const [paypalGifts, setPaypalGifts] = useState([]);
    const [selectedPaypalGift, setSelectedPaypalGift] = useState("");
    const [selectedPaypalGiftID, setSelectedPaypalGiftID] = useState("");
    const [deletePaypalGift, setDeletePaypalGift] = useState("");
    const [actionMessage, setActionMessage] = useState("Delete Paypal Gift");


    useEffect(() => {
        const fetchPaypalGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
                const {paypalGift} = response.data
                setPaypalGifts(paypalGift)
            } catch (error) {
                console.error(error);
            }
        }

        fetchPaypalGift();
    }, [paypalGifts]);

const handlePaypalGiftClick = (id, address) => {
    setSelectedPaypalGiftID(id);
    setSelectedPaypalGift(address);
}

const handleDeletePaypalGiftClick = async () => {
    setActionMessage("Processing");
    try {
        await axios.delete("http://localhost:4001/manager/gift/delete", { data: {paypalGiftId: selectedPaypalGiftID, paypalAddress: deletePaypalGift} });
        setDeletePaypalGift("");
        setSelectedPaypalGift("");
        setSelectedPaypalGiftID("");
        setActionMessage("Delete Paypal Gift");
    } catch (error) {
        console.error(error)
        setDeletePaypalGift("");
        setSelectedPaypalGift("");
        setSelectedPaypalGiftID("");
        setActionMessage("Delete Paypal Gift");
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
                    Delete Paypal Gift
                </h2>
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 pb-6 shadow-xl
                ring-slate-900/5'>
                    {paypalGifts.map((paypalGift)=> {
                        return (
                                <li 
                                onClick={()=> {
                                    handlePaypalGiftClick(paypalGift._id, paypalGift.address )
                                }}
                                key={paypalGift._id}>
                                    <p  className="font-montserrat 
                                    text-slate-gray hover:text-black text-md 
                                    leading-8 my-2 cursor-pointer w-full">
                                        {paypalGift.address}
                                    </p>
                                </li>
                        )
                    })}
                </ul>
                <p  className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-6 text-center">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedPaypalGift}
                    <span className='font-bold font-montserrat'>" to delete Paypal Gift.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray 
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {setDeletePaypalGift(e.target.value)}} 
                placeholder="Address" 
                value={deletePaypalGift} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeletePaypalGiftClick}>
                    {actionMessage}
                </button>
            </div>
    </div>
)};



function CryptoGiftDelete() {
    const [cryptoGifts, setCryptoGifts] = useState([]);
    const [selectedCryptoGift, setSelectedCryptoGift] = useState("");
    const [selectedCryptoGiftID, setSelectedCryptoGiftID] = useState("");
    const [deleteCryptoGift, setDeleteCryptoGift] = useState("");
    const [actionMessage, setActionMessage] = useState("Delete Crypto Gift");


    useEffect(() => {
        const fetchCryptoGift = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/gift/read") 
                const {cryptoGift} = response.data
                setCryptoGifts(cryptoGift)
            } catch (error) {
                console.error(error);
            }
        }

        fetchCryptoGift();
    }, [cryptoGifts]);

const handleCryptoGiftClick = (id, address) => {
    setSelectedCryptoGiftID(id);
    setSelectedCryptoGift(address);
}

const handleDeleteCryptoGiftClick = async () => {
    setActionMessage("Processing");
    try {
        await axios.delete("http://localhost:4001/manager/gift/delete", { data: {cryptoGiftId: selectedCryptoGiftID, cryptoName: deleteCryptoGift} });
        setDeleteCryptoGift("");
        setSelectedCryptoGift("");
        setSelectedCryptoGiftID("");
        setActionMessage("Delete Crypto Gift");
    } catch (error) {
        console.error(error)
        setDeleteCryptoGift("");
        setSelectedCryptoGift("");
        setSelectedCryptoGiftID("");
        setActionMessage("Delete Crypto Gift");
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
                    Delete Crypto Gift
                </h2>
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 pb-6 shadow-xl
                ring-slate-900/5'>
                    {cryptoGifts.map((cryptoGift)=> {
                        return (
                                <li 
                                onClick={()=> {
                                    handleCryptoGiftClick(cryptoGift._id, cryptoGift.cryptoName )
                                }}
                                key={cryptoGift._id}>
                                    <p  className="font-montserrat 
                                    text-slate-gray hover:text-black text-md 
                                    leading-8 my-2 cursor-pointer w-full">
                                        {cryptoGift.cryptoName}
                                    </p>
                                </li>
                        )
                    })}
                </ul>
                <p  className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-6 text-center">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedCryptoGift}
                    <span className='font-bold font-montserrat'>" to delete Crypto Gift.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray 
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {setDeleteCryptoGift(e.target.value)}} 
                placeholder="Crypto Name" 
                value={deleteCryptoGift} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeleteCryptoGiftClick}>
                    {actionMessage}
                </button>
            </div>
    </div>
)};

//////////////////////////////////////////////////////////////////////////EDIT COMMISSION//////////////////////////////////////////////////////////////////////////


function GiftEdit() {
    const [commissions, setCommissions] = useState([]);
    const [commissionID, setCommissionID] = useState("");
    const [artStyle, setArtStyle] = useState("");
    const [artImage, setArtImage] = useState("");
    const [price, setPrice] = useState("");
    const [pricePer, setPricePer] = useState("");
    const [discount, setDiscount] = useState("");
    const [discountInterval, setDiscountInterval] = useState("");
    const [newArtStyle, setNewArtStyle] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newPricePer, setNewPricePer] = useState("");
    const [newDiscount, setNewDiscount] = useState("");
    const [newDiscountInterval, setNewDiscountInterval] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Edit Commission");
    const fileInputRef = useRef(null);


    useEffect(() => {
        const fetchCommission = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manager/commission/read") 
                setCommissions(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchCommission();
    }, [commissions]);

    const handleClick = (artStyle, price, pricePer, discount, discountInterval, id) => {
        setArtStyle(artStyle);
        setPrice(price);
        setPricePer(pricePer);
        setDiscount(discount);
        setDiscountInterval(discountInterval);
        setCommissionID(id);
        setMessage("");
        
    }

    const handleFileChange = (e) => {
        const files = e.target.files;
        setArtImage(...files);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setActionMessage("Pocessing...");
        const formData = new FormData();
        formData.append("id", commissionID);
        formData.append("artStyle", newArtStyle);
        formData.append("artImage", artImage);
        formData.append("price", newPrice);
        formData.append("pricePer", newPricePer);
        formData.append("discount", newDiscount);   
        formData.append("discountInterval", newDiscountInterval);

        try {
        await axios.put("http://localhost:4001/manager/commission/edit", formData, {
            headers: {
            "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Commission updated successfully");
        setArtStyle("");
        setArtImage("");
        setPrice("");
        setPricePer("");
        setDiscount("");
        setDiscountInterval("");
        setNewArtStyle("");
        setArtImage("");
        setNewPrice("");
        setNewPricePer("");
        setNewDiscount("");
        setNewDiscountInterval("");
        setMessageColor("green");
        setActionMessage("Edit Commission");
        fileInputRef.current.value = null;
        } catch (error) {
        setMessage("Error updating commission");
        setMessageColor("red")
        setActionMessage("Edit Commission");
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
                    Edit Commission
                </h2>
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 py-3 shadow-xl
                ring-slate-900/5'>
                    {commissions.map((commission)=> {
                        return (
                            <li key={commission._id}>
                                <p className="font-montserrat 
                                text-slate-gray hover:text-black text-md 
                                leading-8 my-2 cursor-pointer w-full"
                                    onClick={()=> {
                                    handleClick(
                                        commission.artStyle,
                                        commission.price,
                                        commission.pricePer,
                                        commission.discount,
                                        commission.discountInterval, 
                                        commission._id)
                                }}>
                                    {commission.artStyle}
                                </p>
                            </li>
                        )
                    })}
                </ul>
                <h3 className="font-montserrat 
                text-slate-gray text-xl 
                leading-8 mt-6 text-center">
                    <span className='font-montserrat font-bold'>UPDATE - </span>     
                    {artStyle} 
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
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>Art Style</p>
                        <Input type="text" 
                        value={newArtStyle} 
                        placeholder={artStyle} 
                        handleChange={setNewArtStyle}
                        resetMessage={setMessage} />
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>Price</p>
                        <Input type="number" 
                        value={newPrice} 
                        placeholder={price} 
                        handleChange={setNewPrice}
                        resetMessage={setMessage} />
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>Price Per</p>
                        <Input type="text" 
                        value={newPricePer} 
                        placeholder={pricePer} 
                        handleChange={setNewPricePer}
                        resetMessage={setMessage} />
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>Discount</p>
                        <Input type="number" 
                        value={newDiscount} 
                        placeholder={discount} 
                        handleChange={setNewDiscount}
                        resetMessage={setMessage} />
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>Discount Interval</p>
                        <Input type="number" 
                        value={newDiscountInterval} 
                        placeholder={discountInterval} 
                        handleChange={setNewDiscountInterval}
                        resetMessage={setMessage} />
                    </div>                 
                    <div className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'>Select Art Image</p>
                        <input className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100'
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileChange}/>
                    </div>
                    <button className="gap-2 px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black mb-5" 
                    type="submit">
                        {actionMessage}
                    </button>
                </form>
            </div>
    </div>
)};


export default GiftManager;
export {GiftCreate, GiftDelete, GiftEdit};