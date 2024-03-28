import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';




//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function Manager() {
  const navigate = useNavigate();

  function handleNewManga() {
    navigate("/manager/create/manga")
  };

  function handleUploadChapter() {
    navigate("/manager/create/manga/chapter")
  };

  function handleDeleteManga() {
    navigate("/manager/delete/manga")
  };

  function handleDeleteChapter() {
    navigate("/manager/delete/manga/chapter")
  };


  function handleEditManga() {
    navigate("/manager/edit/manga")
  };

  function handleEditChapter() {
    navigate("/manager/edit/manga/chapter")
  };


  return (
    <section className="relatve">
        <section className="min-h-screen flex flex-col items-center">
            <Navbar/>
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center min-h-full"
            >
                ADMIN MANAGER
            </h2>
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-4 shadow-xl
                ring-slate-900/5"
            >
                
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                >
                    <h2 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-6 font-bold"
                    >
                        Create
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md hover:bg-purple-500"
                        onClick={handleNewManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-500 rounded-md hover:bg-purple-400 "
                        onClick={handleUploadChapter}> 
                        Chapter
                    </button>
                </div>
                
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                >
                    <h2 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-6 font-bold"
                    >
                        Delete
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md hover:bg-purple-500"
                        onClick={handleDeleteManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-500 rounded-md hover:bg-purple-400"
                        onClick={handleDeleteChapter}> 
                        Chapter
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                >
                    <h2 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 my-6 font-bold"
                    >
                        Edit
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md hover:bg-purple-500 "
                        onClick={handleEditManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-500 rounded-md hover:bg-purple-400"
                        onClick={handleEditChapter}>
                        Chapter
                    </button>
                </div>
            </div>
        </section>
        <Footer />
    </section>
  )  
};


//////////////////////////////////////////////////////////////////////////CREATE MANGA//////////////////////////////////////////////////////////////////////////


function Create() {
  const [mangas, setMangas] = useState([]);
  const [chapterNumber, setChapterNumber] = useState("");
  const [title, setTitle] = useState("")
  const [mangaID, setMangaID] = useState("")
  const [mangaName, setMangaName] = useState("")
  const [pages, setPages] = useState([]);
  const location = useLocation();
  const currentLocation = location.pathname;
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


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
  };

  const handleFilesChange = (e) => {
      const files = e.target.files;
      setPages([...pages, ...files]);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("coverImage", coverImage);


      try {
          await axios.post("http://localhost:4001/manager/create/manga", formData, {
              headers: {
                  "Content-Type": "multipart/form-data"
              }
          });
          setSuccessMessage("Chapter uploaded successfully");
          setName("");
          setCoverImage("");
      } catch (error) {
          setErrorMessage("Error uploading chapter");
          console.error(error);
      }
  };

  const handleChapterSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("chapterNumber", chapterNumber);
      formData.append("title", title);
      formData.append("mangaID", mangaID)
      formData.append("mangaName", mangaName)
      pages.forEach(page => {
      formData.append("pages", page);
      });

      try {
      await axios.post("http://localhost:4001/manager/create/manga/chapter", formData, {
          headers: {
          "Content-Type": "multipart/form-data"
          }
      });
      setSuccessMessage("Chapter uploaded successfully");
      setChapterNumber("");
      setTitle("");
      setPages([]);
      } catch (error) {
      setErrorMessage("Error uploading chapter");
      console.error(error);
      }
};

return (
    <section className="relative">
        <section className="w-full min-h-screen">
            <Navbar/>
            <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
                bg-white px-6"
            >
                {currentLocation === "/manager/create/manga" ? (
                    <div className="flex flex-col justify-center items-center"
                    > 
                        <h2 className="text-3xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold p-2"
                        >
                            Manga
                        </h2>
                        {successMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'green' }}>{successMessage}</p>}
                        {errorMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'red' }}>{errorMessage}</p>}
                        <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                        bg-white px-6 py-4 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleSubmit}>
                            <input className="gap-5 p-2.5 my-2
                            border border-slate-gray 
                            rounded-full text-center font-montserrat"
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder='Manga Name'
                                />   
                            <div className='flex flex-col items-center'>
                                <label className="flex flex-col items-center font-montserrat 
                                text-slate-gray text-lg 
                                leading-8 my-4 text-center" 
                                >
                                    <p className='mb-4 font-bold'>Select Cover Image</p>
                                    <input  className='block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100'
                                        type="file" 
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            
                            <button className="gap-2 px-7 py-4 my-2 border 
                            font-montserrat text-lg leading-none bg-black
                            rounded-full text-white border-black mb-5"
                                type="submit"
                            >
                                Upload Manga
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center rounded-lg 
                        bg-white px-6 shadow-xl
                        ring-slate-900/5"
                    >
                        <h2  className="text-3xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold p-2 text-center"
                        >
                            Manga Chapter
                        </h2>
                        {successMessage && <p  className="font-montserrat text-lg 
                        leading-8 my-2" 
                        style={{ color: "green" }}>{successMessage}</p>}
                        {errorMessage && <p  className="font-montserrat text-lg 
                        leading-8 my-2" 
                        style={{ color: "red" }}>{errorMessage}</p>}
                        <div className="flex flex-col justify-center items-center mx-5 mb-5 mt-2.5 rounded-lg 
                        bg-white px-6 pb-6 shadow-xl
                        ring-slate-900/5"
                        >
                            <ul className='flex flex-col items-center'>
                                {mangas.map((manga)=>
                                    <li key={manga._id}>
                                        <button className="text-white px-4 py-2 text-sm
                                        font-montserrat font-medium my-2 mx-5
                                        bg-purple-600 rounded-md hover:bg-purple-500"
                                            onClick={()=> {
                                            setMangaID(manga._id)
                                            setMangaName(manga.name)
                                        }}>
                                            {manga.name}
                                        </button>
                                    </li>
                                )}
                            </ul>
                            <h3 className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 my-6"
                            >
                                <span className='font-bold font-montserrat'>UPLOAD TO - </span>{mangaName}
                            </h3>
                        </div>
                        <form  className="flex flex-col justify-center items-center mx-5 mt-5 mb-10 rounded-lg 
                        bg-white px-6 py-4 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleChapterSubmit}
                        >
                    
                                <input className="p-2.5 my-3
                                border border-slate-gray 
                                rounded-full text-center font-montserrat"
                                    type="number" 
                                    value={chapterNumber} 
                                    onChange={(e) => setChapterNumber(e.target.value)}
                                    placeholder='Chapter Number'
                                />
                                <input className="p-2.5 my-3
                                border border-slate-gray 
                                rounded-full text-center font-montserrat" 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Title'
                                />
                            <label  className="flex flex-col items-center font-montserrat 
                                text-slate-gray text-lg 
                                leading-8 my-3 text-center"
                            >
                                <p className='mb-4 font-bold font-montserrat'>Select Pages</p>
                                <input className='block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100'
                                    type="file" multiple 
                                    onChange={handleFilesChange} 
                                    />
                            </label>
                            <button className="gap-2 px-7 py-4 my-2 border 
                            font-montserrat text-lg leading-none bg-black
                            rounded-full text-white border-black mb-5"
                            type="submit"
                            >
                                Upload Chapter
                            </button>
                        </form>
                    </div>
                )
                }
                
            </div>
        </section>
        <Footer />
    </section>
);
};


//////////////////////////////////////////////////////////////////////////DELETE MANGA//////////////////////////////////////////////////////////////////////////


function Delete() {
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
      } catch (error) {
          console.error(error)
      }
  }

  const handleDeleteChapterClick = async () => {
      try {
        await axios.delete("http://localhost:4001/manager/delete/manga/chapter",{data: {mangaID: selectedMangaID, chapterID: selectedChapterID, title: deleteChapterTitle}});
        setDeleteChapterTitle("");
      } catch (error) {
          console.error(error)
      }
  }

  const handleClick = (mangaId) => {
      setClickedMangaId(mangaId === clickedMangaId ? null : mangaId);
  }

  return (
    <section className="relative">
        <section className="w-full min-h-screen">
            <Navbar/>
            <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
                bg-white px-6">
                {currentLocation === "/manager/delete/manga" ? (
                    <div  className="flex flex-col justify-center items-center rounded-lg 
                        bg-white px-6 shadow-xl
                        ring-slate-900/5">
                        <h2 className="text-3xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold p-2"
                        >
                            Manga
                        </h2>
                        <ul className='flex flex-col items-center'>
                            {mangas.map((manga)=> {
                                return (
                                    <>
                                        <li 
                                            onClick={()=> {
                                                handleMangaClick(manga._id, manga.name )
                                            }}
                                            key={manga._id}
                                        >
                                            <button className="text-white px-4 py-2 text-sm
                                            font-montserrat font-medium my-2 mx-5
                                            bg-purple-600 rounded-md hover:bg-purple-500">
                                                {manga.name}
                                            </button>
                                        </li>
                                    </>
                                )
                            })}
                        </ul>
                        <p  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 my-6 text-center"
                        >
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
                            onClick={handleDeleteMangaClick}
                        >
                            Delete Manga
                        </button>
                    </div>
                ) : (
                <div className="flex flex-col justify-center items-center rounded-lg 
                    bg-white px-6 shadow-xl
                    ring-slate-900/5">
                    <h2  className="text-3xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold p-2 text-center"
                    >
                        Manga Chapter
                    </h2>
                    <ul className='flex flex-col items-center'>
                        {mangas.map((manga)=> {
                            return (
                                <li className="flex flex-col justify-center items-center rounded-lg 
                                bg-white px-6 shadow-xl
                                ring-slate-900/5 my-2"
                                    key={manga._id}
                                >
                                    <button className="text-white px-4 py-2 text-sm
                                    font-montserrat font-medium my-3 mx-5
                                    bg-purple-600 rounded-md hover:bg-purple-500"
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
                                                        <button className="text-white px-4 py-2 text-sm
                                                        font-montserrat font-medium my-2 mx-5
                                                        bg-purple-400 rounded-md hover:bg-purple-300"
                                                            onClick={()=> {
                                                            handleChapterClick(manga._id, chapter._id, chapter.title)
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
                    <p  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 my-2 text-center"
                    >
                            <span className='font-bold font-montserrat'>Write "</span>
                            {selectedChapterTitle}
                            <span className='font-bold font-montserrat'>" to delete Chapter.</span>
                    </p>
                    <input className="p-2.5 my-3
                    border border-slate-gray 
                    rounded-full text-center font-montserrat" 
                        onChange={(e)=> {setDeleteChapterTitle(e.target.value)}}     
                        placeholder="Chapter Title"
                        value={deleteChapterTitle} />
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
        </section>
        <Footer />
    </section>
  )
};


//////////////////////////////////////////////////////////////////////////EDIT MANGA//////////////////////////////////////////////////////////////////////////


function Edit() {
  const [mangas, setMangas] = useState([]);
  const [mangaID, setMangaID] = useState("");
  const [mangaContents, setMangaContents] = useState([]);
  const [clickedMangaId, setClickedMangaId] = useState(null);
  const [mangaName, setMangaName] = useState("");
  const [newMangaName, setNewMangaName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [chapterID, setChapterID] = useState("");
  const [pages, setPages] = useState([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [newChapterNumber, setNewChapterNumber] = useState("");
  const [coverImage, setCoverImage] = useState("");


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
  }

  const handleChapterClick = (title, num, id) => {
      setChapterTitle(title);
      setChapterNumber(num);
      setChapterID(id);
  }

  const handleChange = (e) => {
      setNewMangaName(e.target.value);
  }
  
  const handleFileChange = (e) => {
      const files = e.target.files;
      setCoverImage(...files);
  };

  
  const handleFilesChange = (e) => {
          const files = e.target.files;
          setPages([...pages, ...files]);
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
        setSuccessMessage("Chapter updated successfully");
        setMangaName("");
        setNewMangaName("");
        setCoverImage("");
      } catch (error) {
        setErrorMessage("Error updating chapter");
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
        setSuccessMessage("Chapter updated successfully");
        setChapterTitle("");
        setNewChapterTitle("");
        setChapterNumber("");
        setNewChapterNumber("");
        setPages([]);
      } catch (error) {
        setErrorMessage("Error updating chapter");
        console.error(error);
      }
  };
  

  return (
    <section className="relative">
        <section className="w-full min-h-screen">
            <Navbar/>
            <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
                bg-white px-6">
                {currentLocation === "/manager/edit/manga" ? (
                    <div className="flex flex-col justify-center items-center rounded-lg 
                    bg-white px-6 shadow-xl
                    ring-slate-900/5"
                    >
                        <h2 className="text-3xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold p-2"
                        >
                            Manga
                        </h2>
                        <ul className='flex flex-col items-center'>
                            {mangas.map((manga)=> {
                                return (
                                    <li key={manga._id}>
                                        <button className="text-white px-4 py-2 text-sm
                                        font-montserrat font-medium my-2 mx-5
                                        bg-purple-600 rounded-md hover:bg-purple-500"
                                            onClick={()=> {
                                            handleMangaClick(manga.name, manga._id)
                                        }}>
                                            {manga.name}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                        <h3 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 mt-6 text-center"
                        >
                            <span className='font-montserrat font-bold'>UPDATE - </span>     
                            {mangaName} 
                        </h3>
                        {successMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'green' }}>{successMessage}</p>}
                        {errorMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'red' }}>{errorMessage}</p>}
                        <form  className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
                        bg-white px-6 py-4 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleSubmit}>
                            <div className="flex flex-col justify-center items-center m-5 rounded-lg 
                            bg-white px-6 py-4 shadow-xl
                            ring-slate-900/5">
                                <p className='mb-4 font-bold font-montserrat'>Manga Name</p>
                                <input className="p-2.5 mb-3
                                border border-slate-gray 
                                rounded-full text-center font-montserrat" 
                                    type="text" onChange={handleChange} 
                                    value={newMangaName} 
                                    placeholder={mangaName
                                }/>
                            </div>                 
                            <div className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                            bg-white px-6 py-4 shadow-xl
                            ring-slate-900/5">
                                <p className='mb-4 font-bold font-montserrat'>Select Cover Image</p>
                                <input className='block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100'
                                    type="file" 
                                    onChange={handleFileChange}
                                />
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
                    lg:max-w-md font-palanquin font-bold p-2 text-center"
                    >
                        Manga Chapter
                    </h2>
                    <ul className='flex flex-col items-center'> 
                        {mangas.map((manga)=> {
                            return (
                                <li className="flex flex-col justify-center items-center rounded-lg 
                                bg-white px-6 shadow-xl
                                ring-slate-900/5 my-3"
                                    key={manga._id}>
                                    <button className="text-white px-4 py-2 text-sm
                                    font-montserrat font-medium my-2 mx-5
                                    bg-purple-600 rounded-md hover:bg-purple-500"
                                        onClick={()=> {
                                            handleMangaClick(manga.name, manga._id)
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
                                                        <button className="text-white px-4 py-2 text-sm
                                                        font-montserrat font-medium my-2 mx-5
                                                        bg-purple-400 rounded-md hover:bg-purple-300"
                                                            onClick={()=> {
                                                            handleChapterClick(chapter.title, chapter.chapterNumber, chapter._id)
                                                        }}>
                                                        Chapter {chapter.chapterNumber}: {chapter.title}
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-center rounded-lg m-5 
                        bg-white px-6 shadow-xl
                        ring-slate-900/5">
                            <p  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 my3 text-center">
                            <span className='font-montserrat font-bold'>MANGA - </span>{mangaName}
                            </p>
                            <p  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 my-3 text-center">
                            <span className='font-montserrat font-bold'> UPDATE "</span>{chapterTitle}
                            <span className='font-montserrat font-bold'>" CHAPTER.</span>
                            </p>
                        </div>

                       
                        {successMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'green' }}>{successMessage}</p>}
                        {errorMessage && <p className="font-montserrat text-lg 
                        leading-8 my-2"
                            style={{ color: 'red' }}>{errorMessage}</p>}
                        <form className="flex flex-col justify-center items-center mx-5 mb-10 rounded-lg 
                        bg-white px-6 py-4 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleChapterSubmit}
                        >
                            <label className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                            bg-white px-6 py-4 shadow-xl
                            ring-slate-900/5">
                            <p className='mb-4 font-bold font-montserrat'>Chapter Number</p> 
                            <input className="p-2.5 mb-3
                            border border-slate-gray 
                            rounded-full text-center font-montserrat" 
                                type="number" 
                                value={newChapterNumber} onChange={(e) => setNewChapterNumber(e.target.value)} 
                                placeholder={chapterNumber} 
                            />
                            </label>
                            <label className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                            bg-white px-6 py-4 shadow-xl
                            ring-slate-900/5">
                                <p className='mb-4 font-bold font-montserrat'>Title</p> 
                                <input className="p-2.5 mb-3
                                border border-slate-gray 
                                rounded-full text-center font-montserrat" 
                                    type="text" 
                                    value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} 
                                    placeholder={chapterTitle}
                                />
                            </label>
                            <label  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                            bg-white px-6 py-4 shadow-xl
                            ring-slate-900/5">
                                <p className='mb-4 font-bold font-montserrat'> Select Pages</p> 
                                <input  className='block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100'
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
        </section>
        <Footer />
    </section>
  )
};



export default Manager;

export {Create, Delete, Edit};