import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";


function Pages() {

    const [chapter, setChapter] = useState({});
    const [manga, setManga] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(()=>{
        const fetchPages = async () =>{
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                const {chapter, manga} = response.data; 
                setChapter(chapter);
                setManga(manga);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPages();
    }, [location.pathname]);

    useEffect(() => {
    }, [chapter]);

    function handleChange(e) {
        const value = e.target.value;
        navigate("/manga/" + value);
    }

    return (
        <div>
            <select onChange={handleChange}>
                {manga && manga.chapters && manga.chapters.map((chapter)=> {
                    return (
                        <option 
                            key={chapter._id} 
                            value={manga.mangaID + "/"+ chapter._id} 
                            selected={"/manga/" + manga.mangaID + "/"+ chapter._id === location.pathname}
                        >
                            Chapter {chapter.chapterNumber}: {chapter.title}
                        </option>
                )
                })}     
    
            </select>
            <ul>
                {chapter && (
                    <>
                        <h3>{chapter.title}</h3>
                        {chapter.pages && chapter.pages.map((page, index)=>(
                            <div key={index}>
                                <li >
                                    <img src={`http://localhost:4001/${page}`} alt={`Chapter ${page}`} style={{ width: "666px" }}/>
                                </li>
                            </div>
                        ))}
                    </>
                )}        
            </ul> 
        </div>
    );
};


export default Pages;