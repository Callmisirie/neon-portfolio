import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";


function Pages() {

    const [chapter, setChapter] = useState({});
    const location = useLocation();

    
    useEffect(()=>{
        const fetchPages = async () =>{
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                const chapterContent = response.data;
                setChapter(chapterContent)
            } catch (error) {
                console.error(error)
            }
        }
        fetchPages();
    }, [location.pathname]);

    useEffect(() => {
    }, [chapter]);


    return (
        <div>
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