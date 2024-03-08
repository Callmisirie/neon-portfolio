import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      <div>
        <h1>Manga List</h1>
        <ul>
          {mangas.map(manga => (
            <li key={manga._id} onClick={()=>{
              handleClick(manga._id)
            }}>
                <div>
                        <h3>{manga.name}</h3>
                        <img src={`http://localhost:4001/${manga.coverImage}`} alt={`Manga ${manga.coverImage}`} style={{ width: "222px" }}/>
                </div>
            </li>
          ))}
        </ul>
      </div>
    );
};


export default Manga;