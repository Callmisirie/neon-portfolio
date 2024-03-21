import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";


function Pages() {

    const [chapter, setChapter] = useState({});
    const [manga, setManga] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const [toggleView, setToggleView] = useState(true);
    const [selectedPage, setSelectedPage] = useState(1);
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [displayView, setDisplayView] = useState("Long Strip");
    
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


    function handleChapterChange(e) {
        const value = parseInt(e.target.value, 10);
        setSelectedChapter(value);
        manga.chapters.map((chapter, index) => {
            if (value === (index + 1)) {
                navigate("/manga/" + manga.mangaID + "/" + chapter._id);
            }
        });
        setSelectedPage(1);
    }
    

    function handlePageChange(e) {
        const value = e.target.value;
        setSelectedPage(value);
    };

    function handleToggleClick() {
        if (toggleView) {
            setToggleView(false);
            setDisplayView("Page")
        } else {
            setToggleView(true);
            setDisplayView("Long Strip")
            setSelectedPage(selectedPage)
        }
    };

    function handleNextPageClick(pagesLength, chaptersLength) {
        const value = parseInt(selectedPage, 10);
        if (value < pagesLength) {
            setSelectedPage(value + 1);
            window.scrollTo(0, 0);
        } else if (value === pagesLength && parseInt(selectedChapter, 10) < chaptersLength) {

            setSelectedPage("loading");
            // Navigate to the next chapter
            const nextChapterIndex = parseInt(selectedChapter, 10) + 1;
            const nextChapter = manga.chapters[nextChapterIndex - 1]; // Index is 0-based
            navigate(`/manga/${manga.mangaID}/${nextChapter._id}`);
            setSelectedChapter(nextChapterIndex);
            setSelectedPage(1);
            window.scrollTo(0, 0);
        }
    }
    
    function handleNextChapter() {
        const value = (parseInt(selectedChapter, 10) + 1);
        manga.chapters.map((chapter, index) => {
            if (value === (index + 1)) {
                setSelectedPage("loading");
                navigate("/manga/" + manga.mangaID + "/" + chapter._id);
            }
        });
        if (parseInt(selectedChapter, 10) < manga.chapters.length){
            
            setSelectedChapter(value);
        }
        
        if (!toggleView) {
            setSelectedPage(1);
        }
        window.scrollTo(0, 0);
    }

    function handlePreviousChapter() {
        const value = (parseInt(selectedChapter, 10) - 1);
        manga.chapters.map((chapter, index) => {
            if (value === (index + 1)) {
                navigate("/manga/" + manga.mangaID + "/" + chapter._id);
            }
        });
        if ( selectedChapter > 1){
            setSelectedChapter(value);
        }
        if (!toggleView) {
            setSelectedPage(1);
        }
        window.scrollTo(0, 0);
    }
    

    return (
        <div>
            <select onChange={handleChapterChange}>
                {manga && manga.chapters && manga.chapters.map((chapter, index)=> {
                    return (
                        <option 
                            key={chapter._id} 
                            value={(index + 1)} 
                            selected={"/manga/" + manga.mangaID + "/"+ chapter._id === location.pathname}
                        >
                            Chapter {chapter.chapterNumber}: {chapter.title}
                        </option>
                )
                })}     
            </select>

            {!toggleView && (
                <select onChange={handlePageChange}>
                    {chapter && chapter.pages && chapter.pages.map((page, index)=> {
                        return (
                            <option 
                                key={index} 
                                value={(index + 1)} 
                                selected={selectedPage === (index + 1)}
                            >
                                Page: {(index + 1)}
                            </option>
                    )
                    })}     
                </select>
            )}
            <button onClick={handlePreviousChapter}>Previous</button>
            <button onClick={handleToggleClick}><p>{displayView}</p></button>
            <ul>
                {chapter && (
                    <>
                        <h3>{chapter.title}</h3>
                        {toggleView ? (
                            chapter.pages && chapter.pages.map((page, index)=>(
                                <div key={index}>
                                    <li > 
                                        <img src={`http://localhost:4001/display/${page._id}`} alt={`Manga ${page.name}`} style={{ width: "666px" }}/>
                                    </li>
                                </div>
                            ))
                        ) : (
                            <div>
                                {"/manga/" + manga.mangaID + "/" + chapter._id === location.pathname && chapter.pages.map((page, index) => (
                                        parseInt(selectedPage, 10) === (index + 1) && (
                                            <div key={index} onClick={() => {
                                                handleNextPageClick(chapter.pages.length, manga.chapters.length)
                                            }}>
                                                <li>
                                                    <img src={`http://localhost:4001/display/${page._id}`} alt={`Manga ${page.name}`} style={{ width: "666px" }} />
                                                </li>
                                            </div>
                                        )
                                    ))
                                }
                            </div>
                        )}
                    </>
                )}        
            </ul> 
            <button onClick={handleNextChapter}>Next</button>
        </div>
    );
};


export default Pages;