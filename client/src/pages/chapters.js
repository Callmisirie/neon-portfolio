import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";




function Chapters() {
    const [chapters, setChapters] = useState([]);
    const location = useLocation();
    
    useEffect(()=>{
        const fetchChapters = async () =>{
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                const list = response.data.chapters
                setChapters(...list) 
                console.log(chapters);    
            } catch (error) {
                console.error(error)
            }
       
        }
        fetchChapters();
    }, []);

    return (
        <div>
            Chapters
        </div>
    )
};


export default Chapters;