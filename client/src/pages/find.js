import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Find() {
    const location = useLocation();
    const navigate = useNavigate();
    const [foundMangas, setFoundMangas] = useState([]);

    useEffect(()=> {
        const fetchManga = async ()=> {
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                setFoundMangas(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchManga();
    }, []);

    useEffect(()=> {
        console.log(foundMangas);
    }, [foundMangas])

    function handleClick(id) {
        navigate("/manga/" + id)
    }

   return (
    <div>
        {foundMangas && (
            foundMangas.map((manga)=> {
                return (
                    <div key={manga._id} onClick={()=> {
                        handleClick(manga._id)
                    }}>
                        <h3>{manga.name}</h3>
                        <img src={`http://localhost:4001/${manga.coverImage}`} alt={`Manga ${manga.coverImage}`} style={{ width: "111px" }}/>
                    </div>
                )
            })
        )}
    </div>
   ) 
}


export default Find;