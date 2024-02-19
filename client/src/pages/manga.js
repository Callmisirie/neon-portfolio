import React, { useState, useEffect } from "react";
import axios from "axios";

function Manga() {

    const [mangas, setMangas] = useState([]);

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

   

    return (
        <div>
        <h1>Manga List</h1>
        <ul>
          {mangas.map(manga => (
            <li key={manga._id}>
                <div>
                        <p>{manga.name}</p>
                        <img src={`http://localhost:4001/${manga.coverImage}`} alt={`Manga ${manga.coverImage}`} style={{ width: "222px" }}/>
                </div>
            </li>
          ))}
        </ul>
      </div>
    );
};


export default Manga;