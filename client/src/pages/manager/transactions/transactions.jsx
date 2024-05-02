import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function TransactionsManager() {
    const navigate = useNavigate();

    function handleStatus() {
        navigate("/manager/transactions/status")
        window.scrollTo(0, 0);
    };

    function handleDelete() {
        navigate("/manager/transactions/delete")
        window.scrollTo(0, 0);
    };

  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                TRANSACTIONS MANAGER
            </h2>
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5">
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-10 py-8 shadow-xl
                ring-slate-900/5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleStatus}> 
                        Status
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleDelete}> 
                        Delete
                    </button>
                </div>
            </div>
        </section>
  )  
};


//////////////////////////////////////////////////////////////////////////TRANSACTION STATUS//////////////////////////////////////////////////////////////////////////


function TransactionsStatus() {
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [clickedUserId, setClickedUserId] = useState(null);
  const [clickedTransactionHistoryID, setClickedTransactionHistoryID] = useState("");
  const [selectedTransactionHistoryID, setSelectedTransactionHistoryID] = useState("");
  const [checkboxValue, setCheckboxValue] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState(null); // New state to keep track of the selected checkbox ID
  const [transactionHistoryID, setTransactionHistoryID] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [actionMessage, setActionMessage] = useState("Update Status");
  const [isDisabled, setIsDisabled] = useState(false);


  useEffect(() => {
    const fetchTransactionHistories = async () =>{
        try {
            const transactionHistoryResponse = await axios.get("http://localhost:4001/manager/transactionHistory/read");
            const {transactionHistory, users} = transactionHistoryResponse.data;

            setTransactionHistories(transactionHistory)
            setUsers(users)
        } catch (error) {
            console.error(error);
        }
    }
    fetchTransactionHistories();
    }, [transactionHistories]);


    const handleClick = (id) => {
        setClickedUserId(id === clickedUserId ? null : id);
        setClickedTransactionHistoryID("");
        setSelectedCheckbox("");
        setMessage("");
    }

    const handleTransactionDetailsClick = (id) => {
        setClickedTransactionHistoryID(id === clickedTransactionHistoryID ? null : id);
        setSelectedCheckbox("");
        setMessage("");
    }

    function handleCheckboxClick(value) {
        setCheckboxValue(value)
        console.log(value);
    }

    const handleCheckboxChange = (id) => {
        setSelectedCheckbox(id === selectedCheckbox ? "" : id);
        handleCheckboxClick(id === selectedCheckbox ? "" : id);
    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        setActionMessage("Pocessing...");
        setIsDisabled(true);

        console.log({userID: clickedUserId, transactionHistoryID, 
            transactionDetailID: clickedTransactionHistoryID, 
            checkboxValue
        });

        if (!selectedCheckbox) {
            setMessage("New status was not selected");
            setMessageColor("red")
            return
        }

        try {
            const response = await axios.put("http://localhost:4001/manager/transactionHistory/status", {
                userID : clickedUserId,
                transactionHistoryID: transactionHistoryID,
                transactionDetailID: clickedTransactionHistoryID,
                checkboxValue
            });

            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setTransactionHistoryID("");
            setClickedTransactionHistoryID("");
            setActionMessage("Update Status");
            setIsDisabled(false);
        } catch (error) {
            setMessage("Error updating status");
            setMessageColor("red")
            setTransactionHistoryID("");
            setClickedTransactionHistoryID("");
            setActionMessage("Update Status");
            setIsDisabled(false);
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
                Transaction Status
            </h2>
            <ul className='flex flex-col mx-5 w-full
                my-5 px-20 py-2 justify-center items-center'>
                {transactionHistories.map((userTransactionHistories)=> {
                    return (
                        <li className='w-full'
                        key={userTransactionHistories._id}>
                            <p className="font-montserrat
                            text-black text-md leading-8 text-center
                            my-2 font-semibold cursor-pointer"
                            onClick={()=> {
                            handleClick(userTransactionHistories.userID)
                            }}>
                                User ID: <span className="text-sm"> {userTransactionHistories.userID}</span> 
                            </p>
                            {users && users.map((user)=> {
                                return (user._id === userTransactionHistories.userID && (
                                    <p className="font-montserrat
                                    my-2 text-black text-xs text-center">
                                        Name - {user.firstName} {user.lastName}
                                    </p>
                                ))
                            })}
                            <ul  className="flex flex-col-reverse mt-5 px-10
                            bg-white shadow-xl justify-center items-center
                            ring-slate-900/5">
                                {clickedUserId === userTransactionHistories.userID 
                                ? userTransactionHistories.transactionDetails.map((transactionDetail) =>  
                                    <li className='w-full' key={transactionDetail._id}>
                                        <p className="font-montserrat 
                                        text-center text-slate-gray
                                        text-sm leading-8 cursor-pointer"
                                            onClick={()=> {
                                            handleTransactionDetailsClick(transactionDetail._id)
                                        }}>
                                            Transaction ID: <span className="text-xs">{transactionDetail._id}</span> 
                                        </p>
                                        <ul className="flex flex-col 
                                        mb-5 rounded-lg bg-white px-10
                                         shadow-xl ring-slate-900/5">
                                        {clickedTransactionHistoryID === transactionDetail._id && 
                                            <>
                                                <p className="font-montserrat 
                                                text-start text-slate-gray
                                                text-xs my-2">
                                                    Status - <span>{transactionDetail.paymentStatus}</span>    
                                                </p>    
                                                <div className='flex items-center gap-2'>
                                                    <input type='checkbox'
                                                    name='Pending'
                                                    checked={selectedCheckbox === "Pending"}
                                                    onChange={()=> {
                                                        handleCheckboxChange("Pending")
                                                    }}></input> 
                                                    <p className="font-montserrat 
                                                    text-start text-slate-gray
                                                    text-xs my-2">Pending</p>
                                                    </div>
                                                <div className='flex items-center gap-2'>
                                                    <input type='checkbox'
                                                    name="Approved"
                                                    checked={selectedCheckbox === "Approved"}
                                                    onChange={()=> {
                                                        handleCheckboxChange("Approved")
                                                    }}
                                                    /> 
                                                    <p className="font-montserrat 
                                                    text-start text-slate-gray
                                                    text-xs my-2">Approved</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <input type='checkbox'
                                                        name="Cancelled"
                                                        checked={selectedCheckbox === "Cancelled"}
                                                        onChange={()=> {
                                                            handleCheckboxChange("Cancelled")
                                                    }}
                                                    /> 
                                                    <p className="font-montserrat 
                                                    text-start text-slate-gray
                                                    text-xs my-2">Cancelled</p>
                                                </div>
                                                                                          
                                            </>
                                
                                        }
                                        </ul>   
                                    </li>
                                ) : null}
                            </ul>                            
                        </li>
                    )
                })}
            </ul>
            {message && <p className="font-montserrat text-sm 
            leading-8 my-2"  style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <form  className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5"
            onSubmit={handleSubmit}>
                <div className="flex 
                flex-col justify-center 
                items-center m-5 px-6 py-4 ">
                    <p  className="font-montserrat 
                    text-slate-gray text-sm 
                    my-6 text-center">
                        <span className='font-bold'>Write "</span>
                        {clickedTransactionHistoryID}
                        <span className='font-bold'>" to update status.</span>
                    </p>
                    <Input type="text" 
                    value={transactionHistoryID}
                    placeholder="Transaction ID" 
                      handleChange={setTransactionHistoryID}
                    resetMessage={setMessage} />
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


//////////////////////////////////////////////////////////////////////////DELETE TRANSACTION//////////////////////////////////////////////////////////////////////////


function TransactionsDelete() {
    const [transactionHistories, setTransactionHistories] = useState([]);
    const [clickedUserId, setClickedUserId] = useState(null);
    const [clickedTransactionHistoryID, setClickedTransactionHistoryID] = useState("");
    const [transactionHistoryID, setTransactionHistoryID] = useState("");
    const [users, setUsers] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Delete Transaction");
    const [isDisabled, setIsDisabled] = useState(false);
  
  
    useEffect(() => {
        const fetchTransactionHistories = async () =>{
            try {
                const transactionHistoryResponse = await axios.get("http://localhost:4001/manager/transactionHistory/read");
                const {transactionHistory, users} = transactionHistoryResponse.data;

                setTransactionHistories(transactionHistory)
                setUsers(users)
            } catch (error) {
                console.error(error);
            }
        }
        fetchTransactionHistories();
    }, [transactionHistories]);
  

    const handleClick = (id) => {
        setClickedUserId(id === clickedUserId ? null : id);
        setClickedTransactionHistoryID("");
        setMessage("");
    }

    const handleTransactionDetailsClick = (id) => {
        setClickedTransactionHistoryID(id === clickedTransactionHistoryID ? null : id);
        setMessage("");
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setActionMessage("Pocessing...");
        setIsDisabled(true);

        console.log({userID: clickedUserId, transactionHistoryID, 
            transactionDetailID: clickedTransactionHistoryID, 
        });
  

        try {
            const response = await axios.delete("http://localhost:4001/manager/transactionHistory/delete", {data: {
                userID : clickedUserId,
                transactionHistoryID: transactionHistoryID,
                transactionDetailID: clickedTransactionHistoryID,
            }});

            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setTransactionHistoryID("");
            setClickedTransactionHistoryID("");
            setActionMessage("Delete Transaction");
            setIsDisabled(false);
        } catch (error) {
            setMessage("Error deleting transaction");
            setMessageColor("red")
            setTransactionHistoryID("");
            setClickedTransactionHistoryID("");
            setActionMessage("Delete Transaction");
            setIsDisabled(false);
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
                    Delete Transaction
                </h2>
                <ul className='flex flex-col mx-5 w-full
                    my-5 px-20 py-2 justify-center items-center'>
                    {transactionHistories.map((userTransactionHistories)=> {
                        return (
                            <li className='w-full'
                            key={userTransactionHistories._id}>
                            <p className="font-montserrat
                            text-black text-md leading-8 text-center
                            my-2 font-semibold cursor-pointer"
                            onClick={()=> {
                            handleClick(userTransactionHistories.userID)
                            }}>
                                User ID: <span className="text-sm"> {userTransactionHistories.userID}</span> 
                            </p>
                            {users && users.map((user)=> {
                                return (user._id === userTransactionHistories.userID && (
                                    <p className="font-montserrat
                                    my-2 text-black text-xs text-center">
                                        Name - {user.firstName} {user.lastName}
                                    </p>
                                ))
                            })}                              
                                <ul  className="flex flex-col-reverse mt-5 px-10
                                bg-white shadow-xl justify-center items-center
                                ring-slate-900/5">
                                    {clickedUserId === userTransactionHistories.userID 
                                    ? userTransactionHistories.transactionDetails.map((transactionDetail) =>  
                                        <li className='w-full mb-5' key={transactionDetail._id}>
                                            <p className="font-montserrat 
                                            text-center text-slate-gray
                                            text-sm leading-8 cursor-pointer"
                                                onClick={()=> {
                                                handleTransactionDetailsClick(transactionDetail._id)
                                            }}>
                                                Transaction ID: <span className="text-xs">{transactionDetail._id}</span> 
                                            </p>  
                                        </li>
                                    ) : null}
                                </ul>                            
                            </li>
                        )
                    })}
                </ul>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2" style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
                onSubmit={handleSubmit}>
                    <div className="flex 
                    flex-col justify-center 
                    items-center m-5 px-6 py-4 ">
                        <p  className="font-montserrat 
                        text-slate-gray text-sm 
                        my-6 text-center">
                            <span className='font-bold'>Write "</span>
                            {clickedTransactionHistoryID}
                            <span className='font-bold'>" to delete transaction.</span>
                        </p>
                        <Input type="text" 
                        value={transactionHistoryID}
                        placeholder="Transaction ID" 
                        handleChange={setTransactionHistoryID}
                        resetMessage={setMessage} />
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




export default TransactionsManager;
export {TransactionsStatus, TransactionsDelete};