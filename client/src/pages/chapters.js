import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";




function Chapters() {
    const [mangaContent, setMangaContent] = useState({});
    const [manga, setManga] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(()=>{
        const fetchChapters = async () =>{
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                const {mangaContent, manga} = response.data;
                setMangaContent(mangaContent)
                setManga(manga)
            } catch (error) {
                console.error(error)
            }
        }
        fetchChapters();
    }, [location.pathname]);

    useEffect(() => {
    }, [mangaContent]);

    function handleClick(id) {
        navigate(`${location.pathname}/${id}`);
    }

    return (
        <div>
           <ul>
               {mangaContent && (
                    <>  
                        <h3>{mangaContent.mangaName}</h3>
                        <img src={`http://localhost:4001/${manga.coverImage}`} alt={`Manga ${manga.coverImage}`} style={{ width: "222px" }}/>
                        {mangaContent.chapters && mangaContent.chapters.map((chapter) => (
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