import React, { useState, useEffect } from "react";
import axios from "axios";
import NumberOfOrders from "../components/NumberOfOrders";

const Commission = () => {
    const [commissions, setCommissions] = useState([]);
  
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

    



    return (
        <section className="min-h-full">
            <div className=" flex flex-wrap justify-center items-center mx-20 rounded-lg 
            bg-white px-6">
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-4xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2 text-center">
                  Choose Art Style
                </h3>
                <ul className="flex justify-center items-center rounded-lg 
                    bg-white p-3 mx-10 shadow-xl
                    ring-slate-900/5">
                  {commissions.map(commission => (
                    <li  className="flex justify-center items-center rounded-lg 
                    bg-white p-2 mx-10 my-2 shadow-xl
                    ring-slate-900/5"
                    key={commission._id}>
                      <div  className="flex flex-col justify-center items-center m-5 p-2">
                        <h3 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-2 cursor-pointer w-full text-center"
                          onClick={()=>{
                            handleClick(commission._id)
                          }}
                        >
                          {commission.artStyle}
                        </h3>
                        <img className="flex flex-col justify-center rounded-xl m-2 shadow-xl"
                          src={`http://localhost:4001/display/${commission._id}`} 
                          alt={`Manga ${commission.artImage}`} 
                          style={{ width: "120px" }}
                         />
                        <NumberOfOrders commission={commission}/>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>           
            </div>
          </section>
      );
}

export default Commission;