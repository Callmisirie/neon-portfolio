import React, { useState, useEffect } from "react";

let transactionDetails = {
    price: null,
    commissionDetails: null,
    number: null
};

const NumberOfOrders = ({commission}) => {
    transactionDetails.commissionDetails = commission;
    
    const [numberOfOrders, setNumberOfOrders] = useState(parseInt(1, 10));
    const [priceOfOrders, setPriceOfOrders] = useState(parseInt(commission.price, 10));

    function handleDecreaseClick() {   
        if (numberOfOrders > 1) {
            currentPrice((numberOfOrders - parseInt(1, 10)))
            setNumberOfOrders((numberOfOrders - parseInt(1, 10)))
        } 
    }

    function handleIncreaseClick() {
        if (!numberOfOrders) {
            currentPrice((0 + parseInt(1, 10)))
            setNumberOfOrders((0 + parseInt(1, 10))) 
        } else {
            currentPrice((numberOfOrders + parseInt(1, 10)))
            setNumberOfOrders((numberOfOrders + parseInt(1, 10)))
        } 
    }

    function handleChange(e) {
        if (!e.target.value) {
            currentPrice(1)
            setNumberOfOrders((parseInt(1, 10)))        
        } else {
            currentPrice(e.target.value)
            setNumberOfOrders((parseInt(e.target.value, 10)))            
        }

    }



    function currentPrice(num) {
        if (num) {
            const remainderAfterInterval = (parseInt(num, 10) % parseInt(commission.discountInterval, 10))
            const numberOfinterval = (parseInt(num, 10) - remainderAfterInterval)
            const priceOfInterval = (parseInt(commission.price, 10) * numberOfinterval)
            const priceOfIntervalAfterDiscount = priceOfInterval - ((priceOfInterval * parseInt(commission.discount, 10)) / 100)
            const currentPrice = (parseInt(commission.price, 10) * remainderAfterInterval) + priceOfIntervalAfterDiscount
            setPriceOfOrders(currentPrice) 
            transactionDetails.price = currentPrice
            transactionDetails.number = num
        }
    }

    useEffect(() => {
        const fetchTransactionDetails = async () =>{
            if (numberOfOrders === 1) {
                try {
                    currentPrice((parseInt(1, 10)))  
                    setNumberOfOrders((parseInt(1, 10)))  
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchTransactionDetails();
    }, []);
    

  return (
    <div className="flex flex-col justify-center items-center">
        <div  className="flex justify-center items-center">
            <div className="flex m-1
            justify-center items-center cursor-pointer
            w-6 h-6 rounded-md bg-green-400">
                <button className="font-bold text-lg"
                onClick={handleDecreaseClick}>-</button>                 
            </div>
            <input className="text-center font-montserrat
            text-black text-sm border-slate-gray
            leading-8 m-2 outline-none border-none"
            inputmode="numeric" 
            value={numberOfOrders}
            onChange={handleChange}/>
            <div className="flex m-1
            justify-center items-center cursor-pointer
            w-6 h-6 rounded-md bg-green-400">
                <button className="font-bold text-lg"
                onClick={handleIncreaseClick}>+</button>                
            </div>
 
        </div>
        <div className="flex flex-col justify-center items-center">
            <p className="font-montserrat text-green-600 text-center
            text-lg leading-8 my-2 w-full">
                ${priceOfOrders}
            </p>
            <p className="font-montserrat text-slate-gray text-center font-semibold
            text-sm leading-4 my-2 w-full">
                {commission.pricePer}
            </p>  
        </div>
    </div>
  )
}

const handleTransactionDetails = () => {
    window.localStorage.removeItem("transactionDetails")
    window.localStorage.setItem("transactionDetails", JSON.stringify(transactionDetails))
}

export default NumberOfOrders;
export {handleTransactionDetails}