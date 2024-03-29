import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';

function Manga() {

    const [mangas, setMangas] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchCoverImage = async () =>{
            try {
                const response = await axios.get("http://localhost:4001/manga") 
                setMangas(response.data)
            } catch (error) {
               console.error(error);
            }
        }
        fetchCoverImage();
    }, []);

    function handleClick(id) {
      navigate("/manga/" + id);
    }
   
    return (
      <section className="min-h-full">
          {/* <SearchBar /> */}
          <div className=" flex flex-wrap justify-center items-center mx-20 rounded-lg 
            bg-white px-6">
            <div className="flex flex-col justify-center items-center rounded-lg 
                bg-white p-6 shadow-xl
                ring-slate-900/5">
              <h1 className="text-4xl leading-[68px] 
              lg:max-w-md font-palanquin font-bold p-2 text-center mb-5">
                Manga List
              </h1>
              <ul className="">
                {mangas.map(manga => (
                  <li  className="flex flex-col justify-center items-center rounded-lg 
                      bg-white p-3 mx-10 mb-6 shadow-xl
                      ring-slate-900/5"
                    key={manga._id}>
                    <div  className="flex flex-col justify-center items-center m-5 p-5">
            
                      <img className="flex flex-col justify-center rounded-xl m-5 shadow-xl"
                        src={`http://localhost:4001/display/${manga._id}`} 
                        alt={`Manga ${manga.coverImage}`} 
                        style={{ width: "160px" }}
                       />
                      <h3 className="font-montserrat 
                      text-slate-gray hover:text-black text-lg 
                      leading-8 my-2 cursor-pointer w-full text-center"
                        onClick={()=>{
                          handleClick(manga._id)
                        }}
                      >
                        {manga.name}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            
          </div>`
        </section>
    );
};


export default Manga;