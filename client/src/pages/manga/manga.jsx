import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Manga() {
    const [mangas, setMangas] = useState([]);
    const navigate = useNavigate();
  
    
    useEffect(() => {
        const fetchCoverImage = async () =>{
            try {
                const response = await axios.get("https://app.callmineon.com/manga") 
                setMangas(response.data)
            } catch (error) {
               console.error(error);
            }
        }
        fetchCoverImage();
    }, [mangas]);

    function handleClick(id) {
      navigate("/manga/" + id);
      window.scrollTo(0, 0);
    }
   
    return (
      <section className="min-h-full">
          <div className=" flex min-h-screen
          flex-wrap justify-center 
          items-center bg-black">
              {mangas.length ? 
                <>
                  <div className="flex flex-col 
                  min-h-screen items-center bg-white 
                  py-5 px-10 shadow-xl ring-slate-900/5">
                    <h3 className="text-4xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold p-2 text-center mb-5">
                      Manga List
                    </h3>              
                    <ul className="">
                      {mangas.map(manga => (
                        <li  className="flex flex-col justify-center items-center rounded-lg 
                        bg-white mx-10 mb-10 shadow-xl cursor-pointer
                        ring-slate-900/5"
                          key={manga._id}
                          onClick={()=>{
                            handleClick(manga._id)
                          }}>
                          <div  className="flex flex-col justify-center items-center my-10 p-5">
                            <h3 className="font-montserrat 
                            text-slate-gray font-semibold 
                            hover:text-black text-md leading-8 my-2 
                            cursor-pointer max-w-xs text-center hover:font-bold">
                              {manga.name}
                            </h3>
                            <img className="flex flex-col justify-center rounded-xl m-5 shadow-xl"
                              src={`https://app.callmineon.com/display/${manga._id}`} 
                              alt={`Manga ${manga.coverImage}`} 
                              style={{ width: "160px" }}
                              />
                          </div>
                        </li>
                      ))}
                    </ul> 
                  </div>               
                </> : null
              }
            </div>           
        </section>
    );
};


export default Manga;