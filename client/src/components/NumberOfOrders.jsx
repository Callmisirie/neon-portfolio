import React, { useState } from "react";

const NumberOfOrders = ({commission}) => {
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
        currentPrice(e.target.value)
        setNumberOfOrders((parseInt(e.target.value, 10)))
    }
    

    function currentPrice(num) {
        if (num) {
            const remainderAfterInterval = (parseInt(num, 10) % parseInt(commission.discountInterval, 10))
            const numberOfinterval = (parseInt(num, 10) - remainderAfterInterval)
            const priceOfInterval = (parseInt(commission.price, 10) * numberOfinterval)
            const priceOfIntervalAfterDiscount = priceOfInterval - ((priceOfInterval * parseInt(commission.discount, 10)) / 100)
            const currentPrice = (parseInt(commission.price, 10) * remainderAfterInterval) + priceOfIntervalAfterDiscount
            setPriceOfOrders(currentPrice)   
        }
    }

  return (
    <div className="flex flex-col justify-center items-center">
        <div  className="flex justify-center items-center">
            <button onClick={handleDecreaseClick}>-</button> 
            <input className="text-center font-montserrat
            text-black text-sm border border-slate-gray input
            leading-8 m-2"
            type="number" 
            value={numberOfOrders}
            onChange={handleChange}/>
            <button onClick={handleIncreaseClick}>+</button>
        </div>
        <div>
            <p className="font-montserrat text-green-600
            text-lg leading-8 my-2 w-full">
                ${priceOfOrders}
            </p>
        </div>
    </div>

  )
}

export default NumberOfOrders;