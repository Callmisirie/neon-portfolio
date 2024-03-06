import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";




function Chapters() {
    const [manga, setManga] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(()=>{
        const fetchChapters = async () =>{
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                const mangaContent = response.data;
                setManga(mangaContent)
            } catch (error) {
                console.error(error)
            }
        }
        fetchChapters();
    }, [location.pathname]);

    useEffect(() => {
    }, [manga]);

    function handleClick(id) {
        navigate(`${location.pathname}/${id}`);
    }

    return (
        <div>
           <ul>
               {manga && (
                    <>
                        <h3>{manga.mangaName}</h3>
                        {manga.chapters && manga.chapters.map((chapter) => (
                            <div key={chapter._id}>
                                <li>
                                    <button onClick={() => {
                                        handleClick(chapter._id)
                                    }}>Chapter {chapter.chapterNumber} - {chapter.title}</button>
                                </li>
                            </div>
                        ))}
                    </>
                )}
               
           </ul>
        </div>
    )
};


export default Chapters;