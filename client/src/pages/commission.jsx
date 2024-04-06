import React, { useState, useEffect } from "react";
import axios from "axios";
import NumberOfOrders from "../components/NumberOfOrders";

const Commission = () => {
    const [commissions, setCommissions] = useState([]);
    const [commissionID, setCommissionID] = useState(null)
  
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

    

    function handleChooseArtStyle(id) {
      setCommissionID(id === commissionID ? null : id)
    }


    return (
        <section className="min-h-full">
            <div className=" flex flex-wrap justify-center items-center mx-20 rounded-lg 
            bg-white px-6">
              <div  className="flex sm:flex-row flex-col justify-center items-center rounded-lg 
                bg-white px-6 shadow-xl py-5
                ring-slate-900/5">
                <div  className="flex flex-col justify-center items-center
                bg-white mx-2 px-6 py-5 my-5">
                  <h3 className="text-4xl leading-[68px] 
                  lg:max-w-md font-palanquin font-bold p-2 mb-10 text-center">
                    Choose Art Style
                  </h3>
                  <div className="flex flex-col justify-center items-center rounded-lg 
                  bg-white px-6 shadow-xl py-2 my-10
                  ring-slate-900/5">
                    {commissions.map(commission => (
                      <p className="font-montserrat 
                      text-slate-gray hover:text-black 
                      text-md hover:font-semibold px-2
                      leading-8 my-2 cursor-pointer w-full"
                      onClick={()=> {
                        handleChooseArtStyle(commission._id)
                      }}>
                        {commission.artStyle}
                      </p>
                    ))}
                  </div>
                </div>
               
                <ul className="flex flex-col justify-center items-center">
                  {commissions.map(commission => (
                    commission._id === commissionID && (
                      <li  className="flex justify-center items-center rounded-lg 
                      bg-white p-2 m-5 shadow-xl
                      ring-slate-900/5"
                      key={commission._id}>
                        <div  className="flex flex-col justify-center items-center  p-2">
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
                    )
                  ))}
                </ul>
              </div>           
            </div>
          </section>
      );
}

export default Commission;