import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function CommissionManager() {
    const navigate = useNavigate();

    function handleCreate() {
        navigate("/manager/commission/create")
        window.scrollTo(0, 0);
    };

    function handleDelete() {
        navigate("/manager/commission/delete")
        window.scrollTo(0, 0);
    };

    function handleEdit() {
        navigate("/manager/commission/edit")
        window.scrollTo(0, 0);
    };

  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                COMMISSION
            </h2>
            <div className="flex flex-wrap justify-center items-center rounded-lg 
            bg-white p-5 shadow-xl
            ring-slate-900/5">
                <div className="flex flex-col justify-center items-center
                bg-white p-5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleCreate}> 
                        Create
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleDelete}> 
                        Delete
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleEdit}> 
                        Edit
                    </button>
                </div>
            </div>
        </section>
  )  
};


//////////////////////////////////////////////////////////////////////////CREATE COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionCreate() {
    const [commissions, setCommissions] = useState([]);
    const [artStyle, setArtStyle] = useState("");
    const [artImage, setArtImage] = useState("");
    const [price, setPrice] = useState("");
    const [pricePer, setPricePer] = useState("");
    const [discount, setDiscount] = useState("");
    const [discountInterval, setDiscountInterval] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Create");
    const [isDisabled, setIsDisabled] = useState(false);
    const fileInputRef = useRef(null);



useEffect(() => {
    const fetchCommission = async () =>{
        try {
            const response = await axios.get("https://app.callmineon.com/manager/commission/read") 
            setCommissions(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    fetchCommission();
}, []);


const handleFileChange = (e) => {
    const files = e.target.files;
    setArtImage(...files);
    setMessage("");
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setActionMessage("Processing...")
    setIsDisabled(true);
    const formData = new FormData();
    formData.append("artStyle", artStyle);
    formData.append("artImage", artImage);
    formData.append("price", price);
    formData.append("pricePer", pricePer);
    formData.append("discount", discount);   
    formData.append("discountInterval", discountInterval);


    try {
        const response = await axios.post("https://app.callmineon.com/manager/commission/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const {message, color} = response.data;
        setMessage(message);
        setMessageColor(color);
        setArtStyle("");
        setArtImage("");
        setPrice("");
        setPricePer("");
        setDiscount("");
        setDiscountInterval("");
        setActionMessage("Create")
        setIsDisabled(false);
        fileInputRef.current.value = null;
        setTimeout(() => {
            setMessage("");
        }, 5000);
    
        
    } catch (error) {
        setMessage("Error uploading commission");
        setMessageColor("red");
        setArtStyle("");
        setArtImage("");
        setPrice("");
        setPricePer("");
        setDiscount("");
        setDiscountInterval("");
        setActionMessage("Create")
        setIsDisabled(false);
        console.error(error);
        fileInputRef.current.value = null;
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }
};


return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
            <div className="flex flex-col justify-center items-center mb-5"> 
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Create Commission
                </h2>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
                onSubmit={handleSubmit}>   
                    <Input type="text" 
                    value={artStyle} handleChange={setArtStyle} 
                    resetMessage={setMessage} 
                    placeholder="Art Style" />
                    <Input type="number" 
                    value={price} handleChange={setPrice} 
                    resetMessage={setMessage} 
                    placeholder="Price"/>
                    <Input type="text" 
                    value={pricePer} handleChange={setPricePer} 
                    resetMessage={setMessage} 
                    placeholder="Price Per"/>
                    <Input type="number" 
                    value={discount} handleChange={setDiscount} 
                    resetMessage={setMessage} 
                    placeholder="% Discount"/>
                    <Input type="number" 
                    value={discountInterval} handleChange={setDiscountInterval} 
                    resetMessage={setMessage} 
                    placeholder="Discount Interval"/>
                    <div className='flex flex-col items-center'>
                        <label className="flex flex-col items-center font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-4 text-center">
                            <p className='mb-4 font-bold'>Select Art Image</p>
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
                    type="submit"
                    disabled={isDisabled}>
                        {actionMessage}
                    </button>
                </form>
            </div> 
    </div>
);
};


//////////////////////////////////////////////////////////////////////////DELETE COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionDelete() {
    const [commissions, setCommissions] = useState([]);
    const [selectedCommission, setSelectedCommission] = useState("");
    const [selectedCommissionID, setSelectedCommissionID] = useState("");
    const [deleteCommission, setDeleteCommission] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Delete");
    const [isDisabled, setIsDisabled] = useState(false);


    useEffect(() => {
        const fetchCommission = async () =>{
            try {
                const response = await axios.get("https://app.callmineon.com/manager/commission/read") 
                setCommissions(response.data)
            } catch (error) {
                console.error(error);
            }
        }

        fetchCommission();
    }, [commissions]);

const handleCommissionClick = (id, name) => {
    setSelectedCommissionID(id);
    setSelectedCommission(name);
    setMessage("");
}

const handleDeleteCommissionClick = async () => {
    setActionMessage("Processing");
    setIsDisabled(true);

    try {
        const response = await axios.delete("https://app.callmineon.com/manager/commission/delete", { data: {id: selectedCommissionID, artStyle: deleteCommission} });
        
        const {message, color} = response.data;
        setMessage(message);
        setMessageColor(color)
        setDeleteCommission("");
        setSelectedCommission("");
        setSelectedCommissionID("");
        setActionMessage("Delete");
        setIsDisabled(false);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    } catch (error) {
        setMessage("Error deleting commission");
        setMessageColor("red");
        setDeleteCommission("");
        setSelectedCommission("");
        setSelectedCommissionID("");
        setActionMessage("Delete");
        setIsDisabled(false);
        console.error(error)
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }
}

  return (
    <div className="min-h-full flex flex-wrap justify-center items-center">
            <div  className="flex flex-col justify-center items-center rounded-lg mb-10
                bg-white px-10 pb-5 shadow-xl
                ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Delete Commission
                </h2>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <ul className='flex flex-col mx-5 mb-5 rounded-lg 
                bg-white px-5 pb-5 shadow-xl
                ring-slate-900/5'>
                    {commissions.map((commission)=> {
                        return (
                            <li 
                            onClick={()=> {
                                handleCommissionClick(commission._id, commission.artStyle )
                            }}
                            key={commission._id}>
                                <p  className="font-montserrat 
                                text-slate-gray hover:text-black text-sm
                                leading-8 mt-2 cursor-pointer w-full">
                                    {commission.artStyle}
                                </p>
                            </li>
                        )
                    })}
                </ul>
                <p  className="font-montserrat 
                text-slate-gray text-sm max-w-xs
                leading-8 my-5 text-center">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedCommission}
                    <span className='font-bold font-montserrat'>" to delete Commission.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray max-w-fit
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {
                    setDeleteCommission(e.target.value)
                    setMessage("");
                    }} 
                placeholder="Art Style" 
                value={deleteCommission} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeleteCommissionClick}
                disabled={isDisabled}>
                    {actionMessage}
                </button>
            </div>
    </div>
)};


//////////////////////////////////////////////////////////////////////////EDIT COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionEdit() {
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
    const [actionMessage, setActionMessage] = useState("Edit");
    const [isDisabled, setIsDisabled] = useState(false);
    const fileInputRef = useRef(null);


    useEffect(() => {
        const fetchCommission = async () =>{
            try {
                const response = await axios.get("https://app.callmineon.com/manager/commission/read") 
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
        setIsDisabled(true);
        const formData = new FormData();
        formData.append("id", commissionID);
        formData.append("artStyle", newArtStyle);
        formData.append("artImage", artImage);
        formData.append("price", newPrice);
        formData.append("pricePer", newPricePer);
        formData.append("discount", newDiscount);   
        formData.append("discountInterval", newDiscountInterval);

        try {
            const response = await axios.put("https://app.callmineon.com/manager/commission/edit", formData, {
                headers: {
                "Content-Type": "multipart/form-data"
                }
            });

            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setArtStyle("");
            setArtImage("");
            setPrice("");
            setPricePer("");
            setDiscount("");
            setDiscountInterval("");
            setNewArtStyle("");
            setNewPrice("");
            setNewPricePer("");
            setNewDiscount("");
            setNewDiscountInterval("");
            setCommissionID("");
            setActionMessage("Edit");
            setIsDisabled(false);
            setTimeout(() => {
                setMessage("");
            }, 5000);
            fileInputRef.current.value = null;
        } catch (error) {
            setMessage("Error updating commission");
            setMessageColor("red")
            setArtStyle("");
            setArtImage("");
            setPrice("");
            setPricePer("");
            setDiscount("");
            setDiscountInterval("");
            setNewArtStyle("");
            setNewPrice("");
            setNewPricePer("");
            setNewDiscount("");
            setNewDiscountInterval("");
            setCommissionID("");
            setActionMessage("Edit");
            setIsDisabled(false);
            fileInputRef.current.value = null;
            console.error(error); 
            setTimeout(() => {
                setMessage("");
            }, 5000); 
        }
    };

  return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
        bg-white px-6">
            <div className="flex flex-col justify-center items-center rounded-lg mb-10
            bg-white shadow-xl
            ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Edit Commission
                </h2>
                <ul className='flex flex-col mx-5 mb-5 rounded-lg 
                bg-white px-5 pb-5 shadow-xl
                ring-slate-900/5'>
                    {commissions.map((commission)=> {
                        return (
                            <li key={commission._id}>
                                <p className="font-montserrat 
                                text-slate-gray hover:text-black text-sm 
                                leading-8 mt-2 cursor-pointer w-full"
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
                text-slate-gray text-sm 
                leading-8 text-center">
                    <span className='font-montserrat font-bold'>UPDATE - </span>     
                    {artStyle} 
                </h3>
                {message && <p className="font-montserrat text-sm
                leading-8 my-2"  style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center
                bg-white p-5"
                onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center 
                    bg-white px-6 py-4">
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
                        <p className='mt-4 font-bold font-montserrat text-slate-gray'>% Discount</p>
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
                    <div className="flex flex-col justify-center items-center mx-5 mb-5
                    bg-white px-6 py-4">
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
                    type="submit"
                    disabled={isDisabled}>
                        {actionMessage}
                    </button>
                </form>
            </div>
    </div>
)};


export default CommissionManager;
export {CommissionCreate, CommissionDelete, CommissionEdit};