import React, { useState, useEffect } from "react";
import axios from "axios";

function Delete() {

    const [mangas, setMangas] = useState([]);

    useEffect(()=> {
        const fetchManga = async () => {
            try {
                const response = await axios.get("http://localhost:4001/manga");
                setMangas(response.data);
            } catch (error) {
                console.error(error);
            }   
        }
        fetchManga();
    }, [mangas]);

    const handleClick = async (id) => {
        try {
            const response = await axios.delete("http://localhost:4001/manager/delete/manga", { data: { id } });
            console.log(response);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <ul>
                {mangas.map((manga)=> {
                    return (
                        <>
                            <li 
                                onClick={()=> {
                                    handleClick(manga._id)
                                }}
                                key={manga._id}
                            >
                                <button>
                                    {manga.name}
                                </button>
                            </li>
                        </>
                    )
                })}
            </ul>
        </div>
    )
};


export default Delete;