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
                const response = await axios.get(`http://app.callmineon.com${location.pathname}`);
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
        window.scrollTo(0, 0);
    }

    return (
        <section className="min-h-full">
            <div className="flex 
            flex-col min-h-screen 
            items-center bg-black">
                {mangaContent && manga._id && (
                    <div  className="flex flex-col 
                    gap-5 items-center min-h-screen
                    p-10 bg-white shadow-xl">
                        <h3  className="font-montserrat 
                        text-black font-bold max-w-xs
                        leading-8 mx-2 text-center text-md
                        ring-slate-900/5">
                            {mangaContent.mangaName}
                        </h3>
                        <p  className="font-montserrat 
                        text-slate-gray max-w-sm text-center
                        mx-2 text-sm">
                            {manga.about}
                        </p>
                        <div className="flex flex-col justify-center 
                        items-center rounded-lg bg-white p-5 shadow-xl
                        ring-slate-900/5">
                            <div className="flex flex-col justify-center items-center p-5">
                               
                                <img className="flex flex-col justify-center rounded-xl mt-5 mb-10 mx-20 shadow-xl"
                                src={`http://app.callmineon.com/display/${manga._id}`} 
                                alt={`Manga ${manga.coverImage}`} style={{ width: "120px" }}/>
                                <h3 className="font-montserrat 
                                text-black text-md w-full text-center
                                leading-8 mb-5 font-bold">
                                    Author - <span className="text-slate-gray 
                                    my-2 font-semibold" >{manga.author}</span>
                                </h3>
                                <h3 className="font-montserrat 
                                text-black text-lg w-full
                                leading-8 mb-2 font-bold">
                                    Title
                                </h3>
                                {mangaContent.chapters && mangaContent.chapters.map((chapter) => (
                                        
                                    <h3 className="font-montserrat 
                                    text-slate-gray hover:text-black text-md my-2
                                    leading-8 cursor-pointer hover:font-semibold w-full text-left"
                                    onClick={() => {handleClick(chapter._id)}}
                                    key={chapter._id}>
                                        Chapter {chapter.chapterNumber} - {chapter.title}
                                    </h3>
                                    
                                ))}
                            </div>
                        </div>
                    </div>
                    
                )}
            
            </div>
        </section>
   
    )
};
 

export default Chapters;