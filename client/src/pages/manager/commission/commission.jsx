import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function CommissionManager() {
    const navigate = useNavigate();

    function handleCreate() {
        navigate("/manager/commission/create/commission")
    };

    function handleDelete() {
        navigate("/manager/commission/delete/commission")
    };

    function handleEdit() {
        navigate("/manager/commission/edit/commission")
    };

  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                COMMISSION MANAGER
            </h2>
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
            bg-white px-6 py-4 shadow-xl
            ring-slate-900/5">
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-10 py-8 shadow-xl
                ring-slate-900/5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:bg-purple-500"
                    onClick={handleCreate}> 
                        Create
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleDelete}> 
                        Delete
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-500 rounded-md hover:bg-purple-400 "
                    onClick={handleEdit}> 
                        Edit
                    </button>
                </div>
            </div>
        </section>
  )  
};


//////////////////////////////////////////////////////////////////////////CREATE COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionCreate() {
    const [commissions, setCommissions] = useState([]);
    const [chapterNumber, setChapterNumber] = useState("");
    const [title, setTitle] = useState("")
    const [mangaID, setMangaID] = useState("")
    const [mangaName, setMangaName] = useState("")
    const [artStyle, setArtStyle] = useState("");
    const [artImage, setArtImage] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [discountInterval, setDiscountInterval] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");

    const fileInputRef = useRef(null);



useEffect(() => {
    const fetchCommission = async () =>{
        try {
            const response = await axios.get("http://localhost:4001/manager/commission/read") 
            setCommissions(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    fetchCommission();
}, []);


const handleFileChange = (e) => {
    const files = e.target.files;
    setArtImage(...files);
    setMessage("");
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("artStyle", artStyle);
    formData.append("artImage", artImage);
    formData.append("price", price);
    formData.append("discount", discount);   
    formData.append("discountInterval", discountInterval);


    try {
        await axios.post("http://localhost:4001/manager/commission/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Commission uploaded successfully");
        setArtStyle("");
        setArtImage("");
        setPrice("");
        setDiscount("");
        setDiscountInterval("");
        setMessageColor("green");
        fileInputRef.current.value = null;
    
        
    } catch (error) {
        setMessage("Error uploading commission");
        setArtStyle("");
        setArtImage("");
        setPrice("");
        setDiscount("");
        setDiscountInterval("");;
        setMessageColor("red");
        console.error(error);
    }
};


return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
        
            <div className="flex flex-col justify-center items-center"> 
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Create Commission
                </h2>
                {message && <p className="font-montserrat text-lg 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
                onSubmit={handleSubmit}>   
                    <Input type="text" 
                    value={artStyle} handleChange={setArtStyle} 
                    resetMessage={setMessage} 
                    placeholder="Art Style" />
                    <Input type="number" 
                    value={price} handleChange={setPrice} 
                    resetMessage={setMessage} 
                    placeholder="Price"/>
                    <Input type="number" 
                    value={discount} handleChange={setDiscount} 
                    resetMessage={setMessage} 
                    placeholder="Discount"/>
                    <Input type="number" 
                    value={discountInterval} handleChange={setDiscountInterval} 
                    resetMessage={setMessage} 
                    placeholder="Discount Interval"/>
                    <div className='flex flex-col items-center'>
                        <label className="flex flex-col items-center font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-4 text-center">
                            <p className='mb-4 font-bold'>Select Art Image</p>
                            <input  className='block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100'
                            ref={fileInputRef}
                            type="file" 
                            onChange={handleFileChange}/>
                        </label>
                    </div>
                    <button className="gap-2 px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black mb-5"
                    type="submit">
                        Upload Commission
                    </button>
                </form>
            </div> 
    </div>
);
};


//////////////////////////////////////////////////////////////////////////DELETE COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionDelete() {
    const [mangas, setMangas] = useState([]);
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);
    const [selectedMangaName, setSelectedMangaName] = useState("");
    const [selectedMangaID, setSelectedMangaID] = useState("");
    const [deleteMangaName, setDeleteMangaName] = useState("");
    const [selectedChapterTitle, setSelectedChapterTitle] = useState("");
    const [selectedChapterID, setSelectedChapterID] = useState("");
    const [deleteChapterTitle, setDeleteChapterTitle] = useState("");


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

const handleMangaClick = (id, name) => {
    setSelectedMangaID(id);
    setSelectedMangaName(name);
}

const handleChapterClick = (mangaID, chapterID, title) => {
    setSelectedMangaID(mangaID);
    setSelectedChapterID(chapterID);
    setSelectedChapterTitle(title);
}


const handleDeleteMangaClick = async () => {
    try {
        await axios.delete("http://localhost:4001/manager/delete/manga", { data: {id: selectedMangaID, name: deleteMangaName} });
        setDeleteMangaName("");
        setSelectedMangaName("");
    } catch (error) {
        console.error(error)
        setDeleteMangaName("");
        setSelectedMangaName("");
    }
}

const handleDeleteChapterClick = async () => {
    try {
        await axios.delete("http://localhost:4001/manager/delete/manga/chapter",{data: {mangaID: selectedMangaID, chapterID: selectedChapterID, title: deleteChapterTitle}});
        setDeleteChapterTitle("");
        setSelectedChapterTitle("");
    } catch (error) {
        console.error(error)
        setDeleteChapterTitle("");
        setSelectedChapterTitle("");
    }
    }

const handleClick = (mangaId) => {
    setClickedMangaId(mangaId === clickedMangaId ? null : mangaId);
}

  return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
    bg-white px-6">
        {currentLocation === "/manager/manga/delete/manga" ? (
            <div  className="flex flex-col justify-center items-center rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Manga
                </h2>
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 pb-6 shadow-xl
                ring-slate-900/5'>
                    {mangas.map((manga)=> {
                        return (
                            <>
                                <li 
                                onClick={()=> {
                                    handleMangaClick(manga._id, manga.name )
                                }}
                                key={manga._id}>
                                    <p  className="font-montserrat 
                                    text-slate-gray hover:text-black text-md 
                                    leading-8 my-2 cursor-pointer w-full">
                                        {manga.name}
                                    </p>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <p  className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-6 text-center">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedMangaName}
                    <span className='font-bold font-montserrat'>" to delete Manga.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray 
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {setDeleteMangaName(e.target.value)}} 
                placeholder="Manga Name" 
                value={deleteMangaName} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeleteMangaClick}>
                    Delete Manga
                </button>
            </div>
        ) : (
        <div className="flex flex-col justify-center items-center rounded-lg 
        bg-white px-6 shadow-xl py-4
        ring-slate-900/5">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-palanquin font-bold p-2 text-center">
                Manga Chapter
            </h2>
            <ul className=''>
                {mangas.map((manga)=> {
                    return (
                        <li className=""
                            key={manga._id}>
                            <p className="font-montserrat 
                            text-slate-gray hover:text-black text-md 
                            leading-8 my-2 cursor-pointer w-full"
                                onClick={()=> {
                                    handleClick(manga._id)
                                }}>
                                {manga.name}
                            </p>
                            <ul  className="flex flex-col my-2 rounded-lg 
                            bg-white px-6 shadow-xl
                            ring-slate-900/5">
                                {clickedMangaId === manga._id && mangaContents
                                    .filter((mangaContent) => mangaContent.mangaID === manga._id)
                                    .map((mangaContent) =>
                                        mangaContent.chapters.map((chapter) => (
                                            <li key={chapter._id}>
                                                <p className="font-montserrat 
                                                text-slate-gray hover:text-black text-sm 
                                                leading-8 my-2 cursor-pointer w-full"
                                                    onClick={()=> {
                                                    handleChapterClick(manga._id, chapter._id, chapter.title)
                                                }}>
                                                Chapter {chapter.chapterNumber} - {chapter.title}
                                                </p>
                                            </li>
                                        ))
                                    )
                                }
                            </ul>
                        </li>
                    )
                })}
            </ul>
            <p className="font-montserrat 
            text-slate-gray text-lg 
            leading-8 my-2 text-center">
                <span className='font-bold font-montserrat'>Write "</span>
                {selectedChapterTitle}
                <span className='font-bold font-montserrat'>" to delete Chapter.</span>
            </p>
            <input className="p-2.5 my-3
            border border-slate-gray 
            rounded-full text-center font-montserrat" 
                onChange={(e)=> {
                    setDeleteChapterTitle(e.target.value)
                }}     
                placeholder="Chapter Title"
                value={deleteChapterTitle}/>
            <button className="gap-2 px-7 py-4 my-2 border 
            font-montserrat text-lg leading-none bg-black
            rounded-full text-white border-black mb-5"
                onClick={handleDeleteChapterClick}>
                Delete Chapter
            </button>
        </div>
        )
    }   
    </div>
)};


//////////////////////////////////////////////////////////////////////////EDIT COMMISSION//////////////////////////////////////////////////////////////////////////


function CommissionEdit() {
    const [mangas, setMangas] = useState([]);
    const [mangaID, setMangaID] = useState("");
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);
    const [mangaName, setMangaName] = useState("");
    const [newMangaName, setNewMangaName] = useState("");
    const [message, setMessage] = useState("");
    const [chapterID, setChapterID] = useState("");
    const [pages, setPages] = useState([]);
    const [chapterTitle, setChapterTitle] = useState("");
    const [newChapterTitle, setNewChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [newChapterNumber, setNewChapterNumber] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const fileInputRef = useRef(null);


    //use useLocation hook to switch beween edit manga and edit chapter code.
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

    const handleMangaClick = (name, id) => {
        setMangaName(name);
        setMangaID(id);
        setClickedMangaId(id === clickedMangaId ? null : id);
        setMessage("");
        setChapterTitle("");
    }

    const handleChapterClick = (title, num, id) => {
        setChapterTitle(title);
        setChapterNumber(num);
        setChapterID(id);
        setMessage("");
    }

    const handleChange = (e) => {
        setNewMangaName(e.target.value);
        setMessage("");
    }
  
    const handleFileChange = (e) => {
        const files = e.target.files;
        setCoverImage(...files);
        setMessage("");
    };


    const handleFilesChange = (e) => {
        const files = e.target.files;
        setPages([...pages, ...files]);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("mangaID", mangaID);
        formData.append("name", newMangaName);
        formData.append("coverImage", coverImage);


        try {
        await axios.put("http://localhost:4001/manager/edit/manga", formData, {
            headers: {
            "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Manga updated successfully");
        setMangaName("");
        setNewMangaName("");
        setCoverImage("");
        setMessageColor("green")
        fileInputRef.current.value = null;
        } catch (error) {
        setMessage("Error updating manga");
        setMessageColor("red")
        console.error(error);  
        }
    };

    const handleChapterSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("chapterNumber", newChapterNumber);
        formData.append("title", newChapterTitle);
        formData.append("mangaID", mangaID);
        formData.append("chapterID", chapterID);
        pages.forEach(page => {
            formData.append("pages", page);
        });


        try {
        await axios.put("http://localhost:4001/manager/edit/manga/chapter", formData, {
            headers: {
            "Content-Type": "multipart/form-data"
            }
        });
        setMessage("Chapter updated successfully");
        setChapterTitle("");
        setNewChapterTitle("");
        setChapterNumber("");
        setNewChapterNumber("");
        setPages([]);
        setMessageColor("green")
        fileInputRef.current.value = null;
        } catch (error) {
        setMessage("Error updating chapter");
        setMessageColor("red")
        console.error(error);
        }
    };
  

  return (
    <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
        bg-white px-6">
        {currentLocation === "/manager/manga/edit/manga" ? (
            <div className="flex flex-col justify-center items-center rounded-lg 
            bg-white px-6 shadow-xl
            ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Manga
                </h2>
                <ul className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 py-3 shadow-xl
                ring-slate-900/5'>
                    {mangas.map((manga)=> {
                        return (
                            <li key={manga._id}>
                                <p className="font-montserrat 
                                text-slate-gray hover:text-black text-md 
                                leading-8 my-2 cursor-pointer w-full"
                                    onClick={()=> {
                                    handleMangaClick(manga.name, manga._id)
                                }}>
                                    {manga.name}
                                </p>
                            </li>
                        )
                    })}
                </ul>
                <h3 className="font-montserrat 
                text-slate-gray text-xl 
                leading-8 mt-6 text-center">
                    <span className='font-montserrat font-bold'>UPDATE - </span>     
                    {mangaName} 
                </h3>
                {message && <p className="font-montserrat text-lg 
                leading-8 my-2"  style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center mx-5 my-10 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
                onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center m-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'>Manga Name</p>
                        <input className="p-2.5 mb-3
                        border border-slate-gray 
                        rounded-full text-center font-montserrat" 
                        type="text" onChange={handleChange} 
                        value={newMangaName} 
                        placeholder={mangaName}/>
                    </div>                 
                    <div className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'>Select Cover Image</p>
                        <input className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100'
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileChange}/>
                    </div>
                    <button className="gap-2 px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black mb-5" 
                    type="submit">
                        Update Manga 
                    </button>
                </form>
            </div>
        ) : (
        <div className="flex flex-col justify-center items-center rounded-lg 
        bg-white px-6 shadow-xl
        ring-slate-900/5">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-palanquin font-bold p-2 text-center">
                Manga Chapter
            </h2>
            <ul  className='flex flex-col mx-5 mb-5 mt-2.5 rounded-lg 
                bg-white px-6 py-3 shadow-xl
                ring-slate-900/5'> 
                {mangas.map((manga)=> {
                    return (
                        <li key={manga._id}>
                            <p className="font-montserrat 
                            text-slate-gray hover:text-black text-md
                            leading-8 my-2 cursor-pointer w-full"
                            onClick={()=> {handleMangaClick(manga.name, manga._id)}}>
                                {manga.name}
                            </p>
                            <ul className="flex flex-col my-2 rounded-lg 
                            bg-white px-6 shadow-xl
                            ring-slate-900/5">
                                {clickedMangaId === manga._id && mangaContents
                                    .filter((mangaContent) => mangaContent.mangaID === manga._id)
                                    .map((mangaContent) =>
                                        mangaContent.chapters.map((chapter) => (
                                            <li key={chapter._id}>
                                                <p className="font-montserrat 
                                                text-slate-gray hover:text-black text-sm
                                                leading-8 my-2 cursor-pointer w-full"
                                                onClick={()=> {
                                                    handleChapterClick(chapter.title, chapter.chapterNumber, chapter._id)
                                                }}>
                                                Chapter {chapter.chapterNumber} - {chapter.title}
                                                </p>
                                            </li>
                                        ))
                                    )
                                }
                            </ul>   
                        </li>
                    )
                })}
            </ul>
            <div className="flex flex-col justify-center items-center m-3">
                <div className="flex flex-col justify-center items-center m-3">
                    <p  className="font-montserrat 
                    text-slate-gray text-xl 
                    leading-8 my3 text-center">
                    <span className='font-montserrat font-bold'>MANGA - </span>{mangaName}
                    </p>
                    <p className="font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-3 text-center">
                    <span className='font-montserrat font-bold'> UPDATE "</span>{chapterTitle}
                    <span className='font-montserrat font-bold'>" CHAPTER.</span>
                    </p>
                </div>

                
                {message && <p className="font-montserrat text-lg 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
                onSubmit={handleChapterSubmit}>
                    <label className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                    <p className='mb-4 font-bold font-montserrat text-slate-gray'>Chapter Number</p> 
                    <input className="p-2.5 mb-3
                    border border-slate-gray 
                    rounded-full text-center font-montserrat" 
                    type="number" 
                    value={newChapterNumber} onChange={(e) => {
                        setNewChapterNumber(e.target.value)
                        setMessage("")
                    }} 
                    placeholder={chapterNumber}/>
                    </label>
                    <label className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'>Title</p> 
                        <input className="p-2.5 mb-3
                        border border-slate-gray 
                        rounded-full text-center font-montserrat" 
                        type="text" 
                        value={newChapterTitle} onChange={(e) => {
                            setNewChapterTitle(e.target.value)
                            setMessage("")
                        }} 
                        placeholder={chapterTitle}/>
                    </label>
                    <label  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'> Select Pages</p> 
                        <input  className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100'
                        ref={fileInputRef}
                        type="file" 
                        multiple onChange={handleFilesChange}
                            
                        />
                    </label>
                    <button className="gap-2 px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black mb-5"
                    type="submit">
                        Update Chapter
                    </button>
                </form>
            </div>
        </div>
        )}
    </div>
)};


export default CommissionManager;

export {CommissionCreate, CommissionDelete, CommissionEdit};