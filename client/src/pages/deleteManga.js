import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Delete() {

    const [mangas, setMangas] = useState([]);
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);

    //use useLocation hook to switch beween delete manga and delete chapter code.
    const location = useLocation();
    const currentLocation = location.pathname;

    useEffect(()=> {
        const fetchManga = async () => {
            try {
                const MangaResponse = await axios.get("http://localhost:4001/manga");
                setMangas(MangaResponse.data);
                const mangaContentsResponse = await axios.get("http://localhost:4001/chapterContent");
                setMangaContents(mangaContentsResponse.data);
            } catch (error) {
                console.error(error);
            }   
        }
        fetchManga();
    }, [mangas]);

    const handleDeleteMangaClick = async (id) => {
        try {
            const response = await axios.delete("http://localhost:4001/manager/delete/manga", { data: { id } });
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteChapterClick = async (mangaID, chapterID) => {
        try {
            const response = await axios.delete("http://localhost:4001/manager/delete/manga/chapter",{data: {mangaID, chapterID}})
        } catch (error) {
            console.error(error)
        }
    }

    const handleClick = (mangaId) => {
        setClickedMangaId(mangaId === clickedMangaId ? null : mangaId);
    }

    return (
        <div>
            {currentLocation === "/manager/delete/manga" ? (
                <div>
                    <ul>
                        {mangas.map((manga)=> {
                            return (
                                <>
                                    <li 
                                        onClick={()=> {
                                            handleDeleteMangaClick(manga._id)
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
            ) : (
                <div>
                    <ul>
                        {mangas.map((manga)=> {
                            return (
                                <li key={manga._id}>
                                    <button
                                         onClick={()=> {
                                            handleClick(manga._id)
                                        }}
                                    >
                                        {manga.name}
                                    </button>
                                    <ul>
                                        {clickedMangaId === manga._id && mangaContents
                                            .filter((mangaContent) => mangaContent.mangaID === manga._id)
                                            .map((mangaContent) =>
                                                mangaContent.chapters.map((chapter) => (
                                                    <li key={chapter._id}>
                                                        <button onClick={()=> {
                                                            handleDeleteChapterClick(manga._id, chapter._id)
                                                        }}>
                                                            {chapter.title}
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        }
            
           
        </div>
    )
};


export default Delete;