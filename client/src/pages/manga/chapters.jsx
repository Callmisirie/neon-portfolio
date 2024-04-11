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
        window.scrollTo(0, 0);
    }

    return (
        <section className="min-h-full">
            <div className="flex flex-col justify-center items-center rounded-lg 
            bg-white p-6">
                <h3 className="text-4xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2 text-center mb-5">
                    Chapters
                </h3>
                    {mangaContent && (
                        <>  
                            {manga._id && (
                                <div className="flex flex-col justify-center 
                                items-center rounded-lg bg-white p-6 shadow-xl mb-4 mx-5
                                ring-slate-900/5">
                                    <h3  className="font-montserrat 
                                    text-slate-gray  font-bold
                                    leading-8 m-2 w-full text-center">
                                        {mangaContent.mangaName}
                                    </h3>
                                    <div className="flex flex-col justify-center items-center m-5 p-5">
                                        <img className="flex flex-col justify-center rounded-xl my-5 mx-20 shadow-xl"
                                        src={`http://localhost:4001/display/${manga._id}`} 
                                        alt={`Manga ${manga.coverImage}`} style={{ width: "120px" }}/>
                                        <h3 className="font-montserrat 
                                        text-black text-lg w-full
                                        leading-8 my-2 font-bold">
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
                            )}
                        </>
                    )}
            </div>
        </section>
   
    )
};


export default Chapters;