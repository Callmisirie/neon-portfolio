import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextArea from '../../../components/TextArea';
import Input from '../../../components/Input';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function MangaManager() {
    const navigate = useNavigate();

    function handleNewManga() {
        navigate("/manager/manga/create/manga")
        window.scrollTo(0, 0);
    };

    function handleUploadChapter() {
        navigate("/manager/manga/create/manga/chapter")
        window.scrollTo(0, 0);
    };

    function handleDeleteManga() {
        navigate("/manager/manga/delete/manga")
        window.scrollTo(0, 0);
    };

    function handleDeleteChapter() {
        navigate("/manager/manga/delete/manga/chapter")
        window.scrollTo(0, 0);
    };

    function handleEditManga() {
        navigate("/manager/manga/edit/manga")
        window.scrollTo(0, 0);
    };

    function handleEditChapter() {
        navigate("/manager/manga/edit/manga/chapter")
        window.scrollTo(0, 0);
    };


  return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                MANGA
            </h2>
            <div className="flex flex-wrap justify-center items-center rounded-lg 
            bg-white p-5 shadow-xl
            ring-slate-900/5">
                
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">
                    <h2 className="font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-6 font-bold">
                        Create
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleNewManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black "
                    onClick={handleUploadChapter}> 
                        Chapter
                    </button>
                </div>
                
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">
                    <h2 className="font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-6 font-bold">
                        Delete
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleDeleteManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleDeleteChapter}> 
                        Chapter
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">
                    <h2 className="font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-6 font-bold">
                        Edit
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black "
                    onClick={handleEditManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleEditChapter}>
                        Chapter
                    </button>
                </div>
            </div>
        </section>
  )  
};


//////////////////////////////////////////////////////////////////////////CREATE MANGA//////////////////////////////////////////////////////////////////////////


function MangaCreate() {
    const [mangas, setMangas] = useState([]);
    const [chapterNumber, setChapterNumber] = useState("");
    const [title, setTitle] = useState("");
    const [mangaID, setMangaID] = useState("");
    const [mangaName, setMangaName] = useState("");
    const [author, setAuthor] = useState("");
    const [about, setAbout] = useState("");
    const [pages, setPages] = useState([]);
    const location = useLocation();
    const currentLocation = location.pathname;
    const [name, setName] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMangaMessage, setActionMangaMessage] = useState("Upload Manga");
    const [actionChapterMessage, setActionChapterMessage] = useState("Upload Chapter");
    const [isDisabled, setIsDisabled] = useState(false);
    const fileInputRef = useRef(null);



useEffect(() => {
    const fetchCoverImage = async () =>{
        try {
            const response = await axios.get("http://localhost:4001/manga") 
            setMangas(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    fetchCoverImage();
}, []);


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

    setActionMangaMessage("Processing...");
    setIsDisabled(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("author", author);
    formData.append("coverImage", coverImage);
    formData.append("about", about);


    try {
        const response = await axios.post("http://localhost:4001/manager/manga/create/manga", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const {message, color} = response.data;
        setMessage(message);
        setName("");
        setAuthor("");
        setCoverImage("");
        setAbout("");
        setMessageColor(color);
        setActionMangaMessage("Upload Manga");
        setIsDisabled(false);
        fileInputRef.current.value = null;
        setTimeout(() => {
            setMessage("");
        }, 5000);
        
    } catch (error) {
        setMessage("Error uploading manga");
        setName("");
        setAuthor("");
        setCoverImage("");
        setAbout("");
        setMessageColor("red");
        setActionMangaMessage("Upload Manga");
        setIsDisabled(false);
        fileInputRef.current.value = null;
        console.error(error);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }
};

const handleChapterSubmit = async (e) => {
    e.preventDefault();

    setActionChapterMessage("Processing...");
    setIsDisabled(true);
    const formData = new FormData();
    formData.append("chapterNumber", chapterNumber);
    formData.append("title", title);
    formData.append("mangaID", mangaID)
    formData.append("mangaName", mangaName)
    pages.forEach(page => {
        formData.append("pages", page);
    });

    try {
        const response = await axios.post("http://localhost:4001/manager/manga/create/manga/chapter", formData, {headers: {
            "Content-Type": "multipart/form-data"
        }});

        const {message, color} = response.data;
        setMessage(message);
        setMessageColor(color);
        setChapterNumber("");
        setTitle("");
        setPages([]);
        setMangaName("");
        setMangaID("");
        setActionChapterMessage("Upload Chapter")
        setIsDisabled(false);
        fileInputRef.current.value = null;
        setTimeout(() => {
            setMessage("");
        }, 5000);
    } catch (error) {
        setMessage("Error uploading chapter");
        setMessageColor("red");
        setChapterNumber("");
        setTitle("");
        setPages([]);
        setMangaName("");
        setMangaID("");
        setActionChapterMessage("Upload Chapter")
        setIsDisabled(false);
        fileInputRef.current.value = null;
        console.error(error);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }
};

return (
    <div className="min-h-full flex flex-wrap justify-center items-center">
        {currentLocation === "/manager/manga/create/manga" ? (
            <div className="flex flex-col justify-center items-center"> 
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2">
                    Manga
                </h2>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <form  className="flex flex-col justify-center items-center rounded-lg 
                bg-white px-10 py-5 shadow-xl
                ring-slate-900/5"
                onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center 
                    items-center mb-5
                    bg-white p-5">
                        <Input type="text"
                        value={name}
                        handleChange={setName}
                        resetMessage={setMessage}
                        placeholder="Manga Name" /> 
                        <Input type="text"
                        value={about}
                        handleChange={setAbout}
                        resetMessage={setMessage}
                        placeholder="Author" /> 
                        <TextArea type="text"
                        value={about}
                        resetMessage={setMessage}
                        setValue={setAbout}
                        placeholder="About"/> 
                    </div>
                    <div className='flex flex-col items-center'>
                        <label className="flex flex-col items-center font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-4 text-center">
                            <p className='mb-4 font-bold'>Select Cover Image</p>
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
                    type="submit"
                    disabled={isDisabled}>
                        {actionMangaMessage}
                    </button>
                </form>
            </div>
        ) : (
            <div className="flex flex-col justify-center items-center rounded-lg 
                bg-white shadow-xl py-5 px-10
                ring-slate-900/5">
                <h2  className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2 text-center">
                    Manga Chapter
                </h2>
                {message && <p  className="font-montserrat text-sm 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <div className="flex flex-col justify-center items-center 
                bg-white pb-5">
                    <ul className='w-full'>
                        {mangas?.map((manga)=>
                            <li key={manga._id}>
                                <p className="font-montserrat 
                                text-slate-gray hover:text-black hover:font-semibold text-sm 
                                leading-8 my-2 cursor-pointer"
                                onClick={()=> {
                                setMangaID(manga._id)
                                setMangaName(manga.name)}}>
                                    {manga.name}
                                </p>
                            </li>
                        )}
                    </ul>
                    <h3 className="font-montserrat max-w-sm
                    text-slate-gray text-sm 
                    leading-8 mt-5">
                        <span className='font-bold font-montserrat text-black'>UPLOAD TO - </span>{mangaName}
                    </h3>
                </div>
                <form  className="flex flex-col justify-center items-center
                bg-white p-5"
                onSubmit={handleChapterSubmit}>
                    <input className="p-2.5 my-3
                    border border-slate-gray max-w-fit
                    rounded-full text-center font-montserrat"
                    type="number" 
                    value={chapterNumber} 
                    onChange={(e) => {
                        setChapterNumber(e.target.value)
                        setMessage("")
                    }}
                    placeholder='Chapter Number'
                    />
                    <input className="p-2.5 my-3
                    border border-slate-gray max-w-fit
                    rounded-full text-center font-montserrat" 
                    type="text" 
                    value={title} 
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setMessage("")
                    }}
                    placeholder='Title'/>
                    <label  className="flex flex-col items-center font-montserrat 
                    text-slate-gray text-lg 
                    leading-8 my-3 text-center">
                        <p className='mb-4 font-bold font-montserrat'>Select Pages</p>
                        <input className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100'
                        ref={fileInputRef}
                        type="file" multiple 
                        onChange={handleFilesChange}/>
                    </label>
                    <button className="gap-2 px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black mb-5"
                    type="submit"
                    disabled={isDisabled}>
                        {actionChapterMessage}
                    </button>
                </form>
            </div>
        )}
        
    </div>
);
};


//////////////////////////////////////////////////////////////////////////DELETE MANGA//////////////////////////////////////////////////////////////////////////


function MangaDelete() {
    const [mangas, setMangas] = useState([]);
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);
    const [selectedMangaName, setSelectedMangaName] = useState("");
    const [selectedMangaID, setSelectedMangaID] = useState("");
    const [deleteMangaName, setDeleteMangaName] = useState("");
    const [selectedChapterTitle, setSelectedChapterTitle] = useState("");
    const [selectedChapterID, setSelectedChapterID] = useState("");
    const [deleteChapterTitle, setDeleteChapterTitle] = useState("");
    const [actionMangaMessage, setActionMangaMessage] = useState("Delete Manga");
    const [actionChapterMessage, setActionChapterMessage] = useState("Delete Chapter");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);



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

const handleChapterClick = (chapterID, title) => {
    setSelectedChapterID(chapterID);
    setSelectedChapterTitle(title);
}


const handleDeleteMangaClick = async () => {

    setActionMangaMessage("Processing...");
    setIsDisabled(true);

    try {
        const response = await axios.delete("http://localhost:4001/manager/manga/delete/manga", { data: {id: selectedMangaID, name: deleteMangaName} });
        const {message, color} = response.data;
        setDeleteMangaName("");
        setSelectedMangaName("");
        setSelectedMangaID("");
        setActionMangaMessage("Delete Manga");
        setMessage(message);
        setMessageColor(color);
        setIsDisabled(false);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    } catch (error) {
        console.error(error)
        setDeleteMangaName("");
        setSelectedMangaName("");
        setSelectedMangaID("");
        setActionMangaMessage("Delete Manga");
        setMessage("Error deleting manga");
        setMessageColor("red");
        setIsDisabled(false);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }
}

const handleDeleteChapterClick = async () => {

    setIsDisabled(true);
    setActionChapterMessage("Processing...");

    try {
        const response = await axios.delete("http://localhost:4001/manager/manga/delete/manga/chapter",{data: {mangaID: selectedMangaID, chapterID: selectedChapterID, title: deleteChapterTitle}});
        const {message, color} = response.data;
        setDeleteChapterTitle("");
        setSelectedChapterTitle("");
        setSelectedChapterID("");
        setActionChapterMessage("Delete Chapter");
        setMessage(message);
        setMessageColor(color);
        setIsDisabled(false);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    } catch (error) {
        console.error(error)
        setDeleteChapterTitle("");
        setSelectedChapterTitle("");
        setSelectedChapterID("");
        setActionChapterMessage("Delete Chapter");
        setMessage("Error deleting manga");
        setMessageColor("red");
        setIsDisabled(false);
        setTimeout(() => {
            setMessage("");
        }, 5000);
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
                bg-white px-5 pb-5 shadow-xl
                ring-slate-900/5">
                <h2 className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold">
                    Manga
                </h2>
                {message && <p className="font-montserrat text-sm 
                leading-8 my-2"
                style={{ color:`${messageColor}`}}>
                    {message}
                </p>}
                <ul className='flex flex-col mx-5 mb-5 rounded-lg 
                bg-white px-5'>
                    {mangas?.map((manga)=> {
                        return (
                            <li 
                            onClick={()=> {
                                handleMangaClick(manga._id, manga.name )
                            }}
                            key={manga._id}>
                                <p  className="font-montserrat 
                                text-slate-gray hover:text-black text-sm
                                leading-8 mt-2 cursor-pointer">
                                    {manga.name}
                                </p>
                            </li>
                        )
                    })}
                </ul>
                <p  className="font-montserrat max-w-sm
                text-slate-gray text-sm
                leading-8 my-6">
                    <span className='font-bold font-montserrat'>Write "</span>
                    {selectedMangaName}
                    <span className='font-bold font-montserrat'>" to delete Manga.</span>
                </p>
                <input className="p-2.5 my-3
                border border-slate-gray max-w-fit
                rounded-full text-center font-montserrat" 
                onChange={(e)=> {
                    setDeleteMangaName(e.target.value)
                    setMessage("");
                }} 
                placeholder="Manga Name" 
                value={deleteMangaName} />
                <button className="gap-2 px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black mb-5"
                onClick={handleDeleteMangaClick}
                disabled={isDisabled}>
                    {actionMangaMessage}
                </button>
            </div>
        ) : (
        <div className="flex flex-col justify-center items-center rounded-lg 
        bg-white px-10 shadow-xl pb-5
        ring-slate-900/5">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-palanquin font-bold p-2 text-center">
                Manga Chapter
            </h2>
            {message && <p className="font-montserrat text-sm 
            leading-8 my-2"
            style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <ul className=''>
                {mangas?.map((manga)=> {
                    return (
                        <li className=""
                            key={manga._id}>
                            <p className="font-montserrat 
                            text-slate-gray hover:text-black text-sm
                            leading-8 mt-2 cursor-pointer w-full"
                                onClick={()=> {
                                    handleClick(manga._id)
                                    setSelectedMangaID(manga._id);
                                    setSelectedChapterTitle("");
                                }}>
                                {manga.name}
                            </p>
                            <ul  className="flex flex-col mb-2 rounded-lg 
                            bg-white px-6 shadow-xl
                            ring-slate-900/5">
                                {clickedMangaId === manga._id && mangaContents?.filter((mangaContent) => mangaContent.mangaID === manga._id).map((mangaContent) =>
                                        mangaContent.chapters.map((chapter) => (
                                            <li key={chapter._id}>
                                                <p className="font-montserrat 
                                                text-slate-gray hover:text-black text-xs 
                                                leading-8 mb-2 cursor-pointer w-full"
                                                    onClick={()=> {
                                                    handleChapterClick(chapter._id, chapter.title)
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
            text-slate-gray text-md 
            leading-8 my-2 text-center">
                <span className='font-bold font-montserrat'>Write "</span>
                {selectedChapterTitle}
                <span className='font-bold font-montserrat'>" to delete Chapter.</span>
            </p>
            <input className="p-2.5 my-3
            border border-slate-gray max-w-fit
            rounded-full text-center font-montserrat" 
                onChange={(e)=> {
                    setDeleteChapterTitle(e.target.value)
                    setMessage("")
                }}     
                placeholder="Chapter Title"
                value={deleteChapterTitle}/>
            <button className="gap-2 px-7 py-4 my-2 border 
            font-montserrat text-lg leading-none bg-black
            rounded-full text-white border-black mb-5"
            onClick={handleDeleteChapterClick}
            disabled={isDisabled}>
                {actionChapterMessage}
            </button>
        </div>
        )
    }   
    </div>
)};


//////////////////////////////////////////////////////////////////////////EDIT MANGA//////////////////////////////////////////////////////////////////////////


function MangaEdit() {
    const [mangas, setMangas] = useState([]);
    const [mangaID, setMangaID] = useState("");
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);
    const [mangaName, setMangaName] = useState("");
    const [newMangaName, setNewMangaName] = useState("");
    const [author, setAuthor] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [about, setAbout] = useState("");
    const [newAbout, setNewAbout] = useState("");
    const [message, setMessage] = useState("");
    const [chapterID, setChapterID] = useState("");
    const [pages, setPages] = useState([]);
    const [chapterTitle, setChapterTitle] = useState("");
    const [newChapterTitle, setNewChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [newChapterNumber, setNewChapterNumber] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMangaMessage, setActionMangaMessage] = useState("Edit Manga");
    const [actionChapterMessage, setActionChapterMessage] = useState("Edit Chapter");
    const [isDisabled, setIsDisabled] = useState(false);
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

    const handleMangaClick = (name, author, about, id) => {
        setMangaName(name);
        setAuthor(author);
        setAbout(about);
        setMangaID(id);
        setClickedMangaId(id === clickedMangaId ? null : id);
        setMessage("");
        setChapterTitle("");
    }

    const handleMangaContentClick = (name, id) => {
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
        setIsDisabled(true);

        setActionMangaMessage("Processing...");
        const formData = new FormData();
        formData.append("mangaID", mangaID);
        formData.append("name", newMangaName);
        formData.append("author", newAuthor);
        formData.append("about", newAbout);
        formData.append("coverImage", coverImage);

        try {
            const response = await axios.put("http://localhost:4001/manager/manga/edit/manga", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const {message, color} = response.data;

            setMessage(message);
            setMessageColor(color);
            setMangaName("");
            setNewMangaName("");
            setAuthor("");
            setNewAuthor("");
            setAbout("");
            setNewAbout("");
            setCoverImage("");
            setMangaID("");
            setActionMangaMessage("Edit Manga");
            setIsDisabled(false);
            fileInputRef.current.value = null;
            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (error) {
            setMessage("Error updating manga");
            setMessageColor("red")
            setMangaName("");
            setNewMangaName("");
            setAuthor("");
            setNewAuthor("");
            setAbout("");
            setNewAbout("");
            setCoverImage("");
            setMangaID("");
            setActionMangaMessage("Edit Manga");
            setIsDisabled(false);
            console.error(error);
            setTimeout(() => {
                setMessage("");
            }, 5000);  
        }
    };

    const handleChapterSubmit = async (e) => {
        e.preventDefault();
        setIsDisabled(true);

        setActionChapterMessage("Processing...");
        const formData = new FormData();
        formData.append("chapterNumber", newChapterNumber);
        formData.append("title", newChapterTitle);
        formData.append("mangaID", mangaID);
        formData.append("chapterID", chapterID);
        pages.forEach(page => {
            formData.append("pages", page);
        });


        try {
            const response = await axios.put("http://localhost:4001/manager/manga/edit/manga/chapter", formData, {
                headers: {
                "Content-Type": "multipart/form-data"
                }
            });
            const {message, color} = response.data;

            setMessage(message);
            setMessageColor(color);
            setChapterTitle("");
            setNewChapterTitle("");
            setChapterNumber("");
            setNewChapterNumber("");
            setPages([]);
            setChapterID("");
            setActionChapterMessage("Edit Chapter");
            setIsDisabled(false);
            fileInputRef.current.value = null;
            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (error) {
            setMessage("Error updating chapter");
            setMessageColor("red");
            setChapterTitle("");
            setNewChapterTitle("");
            setChapterNumber("");
            setNewChapterNumber("");
            setPages([]);
            setChapterID("");
            setActionChapterMessage("Edit Chapter");
            setIsDisabled(false);
            fileInputRef.current.value = null;
            console.error(error);
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    };
  

    return (
        <div className="min-h-full flex flex-wrap justify-center items-center">
            {currentLocation === "/manager/manga/edit/manga" ? (
                <div className="flex flex-col justify-center items-center rounded-lg 
                bg-white shadow-xl px-5
                ring-slate-900/5">
                    <h2 className="text-3xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold">
                        Manga
                    </h2>
                    <ul className='flex flex-col mb-5
                    bg-white px-5'>
                        {mangas?.map((manga)=> {
                            return (
                                <li key={manga._id}>
                                    <p className="font-montserrat 
                                    text-slate-gray hover:text-black text-sm
                                    leading-8 mt-2 cursor-pointer w-full"
                                        onClick={()=> {
                                        handleMangaClick(manga.name, manga.author, manga.about, manga._id)
                                    }}>
                                        {manga.name}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                    <h3 className="font-montserrat 
                    text-slate-gray text-sm max-w-sm
                    leading-8">
                        <span className='font-montserrat font-bold'>UPDATE - </span>     
                        {mangaName} 
                    </h3>
                    {message && <p className="font-montserrat text-sm 
                    leading-8 my-2"  style={{ color:`${messageColor}`}}>
                        {message}
                    </p>}
                    <form  className="flex flex-col justify-center items-center mb-5
                    bg-white"
                    onSubmit={handleSubmit}>
                        <div className="flex flex-col justify-center items-center mb-5 
                        bg-white p-5">
                            <p className='mt-4 font-bold font-montserrat text-slate-gray'>Manga Name</p>
                            <Input type="text"
                            value={newMangaName}
                            handleChange={setNewMangaName}
                            resetMessage={setMessage}
                            placeholder={mangaName}/>
                            <p className='mt-4 font-bold font-montserrat text-slate-gray'>Author</p>
                            <Input type="text"
                            value={newAuthor}
                            handleChange={setNewAuthor}
                            resetMessage={setMessage}
                            placeholder={author}/>
                            <p className='mt-4 font-bold font-montserrat text-slate-gray'>About</p>
                            <TextArea type="text"
                            value={newAbout}
                            resetMessage={setMessage}
                            setValue={setNewAbout}
                            placeholder={about}/>
                        </div>                 
                        <div className="flex flex-col justify-center items-center mx-5 mb-5
                        bg-white px-6 py-4">
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
                        type="submit"
                        disabled={isDisabled}>
                            {actionMangaMessage} 
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
                <ul  className='flex flex-col mb-5 
                bg-white px-6'> 
                    {mangas?.map((manga)=> {
                        return (
                            <li key={manga._id}>
                                <p className="font-montserrat 
                                text-slate-gray hover:text-black text-sm
                                leading-8 mt-2 cursor-pointer w-full"
                                onClick={()=> {handleMangaContentClick(manga.name, manga._id)}}>
                                    {manga.name}
                                </p>
                                <ul className="flex flex-col rounded-lg 
                                bg-white px-6 shadow-xl
                                ring-slate-900/5">
                                    {clickedMangaId === manga._id && mangaContents?.filter((mangaContent) => mangaContent.mangaID === manga._id).map((mangaContent) =>
                                            mangaContent.chapters?.map((chapter) => (
                                                <li key={chapter._id}>
                                                    <p className="font-montserrat 
                                                    text-slate-gray hover:text-black text-xs
                                                    leading-8 mb-2 cursor-pointer w-full"
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
                <div className="flex flex-col justify-center items-center ">
                    <div className="flex flex-col justify-center items-center w-full">
                        <p  className="font-montserrat 
                        text-slate-gray text-sm max-w-sm
                        leading-8 my-5">
                            <span className='font-montserrat font-bold'>MANGA - </span>{mangaName}
                        </p>
                        <p className="font-montserrat 
                        text-slate-gray text-sm max-w-xs
                        leading-8 mb-5">
                            <span className='font-montserrat font-bold'> UPDATE "</span>{chapterTitle}
                            <span className='font-montserrat font-bold'>" CHAPTER.</span>
                        </p>
                    </div>

                    
                    {message && <p className="font-montserrat text-sm 
                    leading-8 my-2"
                    style={{ color:`${messageColor}`}}>
                        {message}
                    </p>}
                    <form className="flex flex-col justify-center items-center mb-10 rounded-lg 
                    bg-white"
                    onSubmit={handleChapterSubmit}>
                        <label className="flex flex-col justify-center items-center
                        bg-white p-5">
                        <p className='mb-4 font-bold font-montserrat text-slate-gray'>Chapter Number</p> 
                        <input className="p-2.5 mb-3
                        border border-slate-gray max-w-fit
                        rounded-full text-center font-montserrat" 
                        type="number" 
                        value={newChapterNumber} onChange={(e) => {
                            setNewChapterNumber(e.target.value)
                            setMessage("")
                        }} 
                        placeholder={chapterNumber}/>
                        </label>
                        <label className="flex flex-col justify-center items-center mx-5
                        bg-white px-6 py-4">
                            <p className='mb-4 font-bold font-montserrat text-slate-gray'>Title</p> 
                            <input className="p-2.5 mb-3
                            border border-slate-gray max-w-fit
                            rounded-full text-center font-montserrat" 
                            type="text" 
                            value={newChapterTitle} onChange={(e) => {
                                setNewChapterTitle(e.target.value)
                                setMessage("")
                            }} 
                            placeholder={chapterTitle}/>
                        </label>
                        <label  className="flex flex-col justify-center items-center mx-5
                        bg-white px-6 py-4">
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
                        type="submit"
                        disabled={isDisabled}>
                            {actionChapterMessage}
                        </button>
                    </form>
                </div>
            </div>
            )}
        </div>
    )};


export default MangaManager;

export {MangaCreate, MangaDelete, MangaEdit};