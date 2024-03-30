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
        <section className="min-h-full">
            <div className="flex flex-col justify-center 
            items-center bg-white p-6">
                <div className="flex">
                    <label htmlFor="toggle" className="flex items-center cursor-pointer">
                        <p className="font-montserrat 
                        text-black text-md mx-2 text-center">
                            {displayView}
                        </p>
                        <div className="flex items-center"
                       >
                            <input
                                id="toggle"
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={toggle}
                            />
                            <div className="w-10 h-4 border border-black rounded-full"></div>
                            <div className={`dot absolute w-6 h-6 bg-purple-600 rounded-full shadow ${
                            isChecked ? 'translate-x-full bg-purple-300' : ''
                            } transition`}
                            ></div>
                        </div>
                    </label>
                    
                    <select className="p-1 m-3 border border-black font-montserrat text-sm" 
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
                        <select className="p-1 m-3 border border-black font-montserrat text-sm"
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
                    <button className="px-4 py-2 my-2 border 
                    font-montserrat text-md leading-none bg-black
                    rounded-md text-white border-black mb-5"
                    onClick={handlePreviousChapter}>
                        Previous
                    </button>
                <ul className="flex flex-col justify-center 
                items-center rounded-lg bg-white p-6 shadow-xl mb-4
                ring-slate-900/5">
                    {chapter && (
                        <>
                            <h3 className="font-montserrat 
                            text-black text-xl 
                            leading-8 my-2 cursor-pointer 
                            w-full text-center font-bold">
                                {chapter.title}
                            </h3>
                            {toggleView ? ("/manga/" + manga.mangaID + "/" + chapter._id === location.pathname && chapter.pages && chapter.pages.map((page, index)=>(
                                <div className="mx-10"
                                key={index}>
                                    <li > 
                                        <img src={`http://localhost:4001/display/${page._id}`} alt={`Manga ${page.name}`} style={{ width: "666px" }}/>
                                    </li>
                                </div>
                                ))
                            ) : (
                            <div className="mx-10">
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
                <button className="px-4 py-2 my-2 border 
                font-montserrat text-md leading-none bg-black
                rounded-md text-white border-black mb-5"
                onClick={handleNextChapter}>
                    Next
                </button>
            </div>
        </section>

    );
};


export default Pages;