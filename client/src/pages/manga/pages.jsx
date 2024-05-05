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
    const [displayView, setDisplayView] = useState("Long Strip Page");
    const [isChecked, setIsChecked] = useState(false);

    const toggle = () => {
      setIsChecked(!isChecked);
      handleToggleClick();
    }

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
            setDisplayView("Single Page")
        } else {
            setToggleView(true);
            setDisplayView("Long Strip Page")
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
                setSelectedPage(1);
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
    
    function handleGift() {
        navigate("/gift");
        window.scrollTo(0, 0);
    }

    return (
        <section className="min-h-full">
            <div className="flex flex-col 
            bg-black min-h-screen
            items-center">
                <div className="flex mt-5 p-3
                sm:flex-row flex-col justify-center 
                items-center rounded-md bg-black
                border border-white">
                    <label htmlFor="toggle" className="flex items-center cursor-pointer">
                        <p className="font-montserrat 
                        text-white text-md mx-2 text-center">
                            {displayView}
                        </p>
                        <div className="flex items-center">
                            <input
                                id="toggle"
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={toggle}
                            />
                            <div className="w-12 h-4 border bg-black border-white rounded-full"></div>
                            <div className={`dot absolute w-6 h-6 ${isChecked ? 
                            'bg-purple-600' : 'bg-slate-gray'} rounded-full shadow 
                            ${isChecked ? 'translate-x-full' : ''} transition`}></div>
                        </div>
                    </label>
                    
                    <select className="p-1 m-3 border 
                    text-white bg-black border-white 
                    font-montserrat text-sm cursor-pointer" 
                    onChange={handleChapterChange}>
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
                        <select className="p-1 m-3 border 
                        border-white bg-black text-white 
                        font-montserrat text-sm cursor-pointer"
                        onChange={handlePageChange}>
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
                </div>
                    <button className="px-4 py-2 my-5 border opacity-90
                    font-montserrat text-md leading-none bg-black
                    rounded-md text-white border-white mb-5 
                    hover:opacity-100"
                    onClick={handlePreviousChapter}>
                        Previous Chapter
                    </button>
                    {chapter.pages?.length && "/manga/" + manga.mangaID + "/" + chapter._id === location.pathname ? (
                        <>
                            <ul className="flex flex-col 
                            items-center rounded-3xl 
                            bg-white min-h-screen p-6 
                            shadow-xl ring-slate-900/5">                        
                                <h3 className="font-montserrat 
                                text-black text-xl leading-8 my-6 
                                w-full text-center font-bold">
                                    {chapter.title}
                                </h3>
                                {toggleView ? ("/manga/" + manga.mangaID + "/" + chapter._id === location.pathname && chapter.pages && chapter.pages.map((page, index)=>(
                                    <div className="sm:mx-5"
                                    key={index}>
                                        <li > 
                                            <img src={`http://localhost:4001/display/${page._id}`} alt={`Manga ${page.name}`} style={{ width: "666px" }}/>
                                        </li>
                                    </div>
                                    ))
                                ) : (
                                <div className="sm:mx-5">
                                    {"/manga/" + manga.mangaID + "/" + chapter._id === location.pathname && chapter.pages.map((page, index) => (
                                        parseInt(selectedPage, 10) === (index + 1) && (
                                            <div className="cursor-pointer"
                                            key={index} onClick={() => {
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
                            </ul>    
                        </>
                    ) : null}        
 
                <div className="flex flex-col justify-center items-center">
                    <button className="px-4 py-2 border opacity-90
                    font-montserrat text-md leading-none bg-black
                    rounded-md text-white border-white mt-5 
                    hover:opacity-100"
                    onClick={handleNextChapter}>
                        Next Chapter
                    </button>
                    <button className="px-4 py-2 border 
                    font-montserrat text-md leading-none bg-green-500
                    rounded-md text-white border-green-500 my-5 
                    hover:bg-green-600 hover:border-green-600 w-full"
                    onClick={handleGift}>
                        Gift
                    </button>
                </div>
              
            </div>
        </section>

    );
};


export default Pages;