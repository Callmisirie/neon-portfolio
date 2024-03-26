import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



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
    <section className="xl:padding-l wide:padding-r padding-b">
        <section className="w-full flex 
            xl:flex-row flex-col justify-center 
            min-h-screen gap-10 max-container"
        >
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5"
            >
                <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                >
                    <h2 className="font-montserrat 
                        text-slate-gray text-lg 
                        leading-8 mt-6 mb-14"
                    >
                        Create
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-600 rounded-md "
                        onClick={handleNewManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-400 rounded-md "
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
                        leading-8 mt-6 mb-14"
                    >
                        Delete
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-600 rounded-md "
                        onClick={handleDeleteManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-400 rounded-md "
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
                        leading-8 mt-6 mb-14"
                    >
                        Edit
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-600 rounded-md "
                        onClick={handleEditManga}> 
                        Manga
                    </button>
                    <button className="text-white px-4 py-2 text-sm
                            font-montserrat font-medium mt-8 mx-5
                            bg-purple-400 rounded-md "
                        onClick={handleEditChapter}>
                        Chapter
                    </button>
                </div>
            </div>
        </section>
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
    <section className="xl:padding-l wide:padding-r padding-b">
        <section className="w-full flex 
        xl:flex-row flex-col justify-center 
        min-h-screen gap-10 max-container"
        >
            <div className="flex flex-wrap justify-center items-center m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5"
            >
                {currentLocation === "/manager/create/manga" ? (
                    <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                    > 
                        <h2 className="text-3xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold"
                        >
                            Manga
                        </h2>
                        {successMessage && <p className="font-montserrat text-lg 
                        leading-8 mt-6 mb-14"
                            style={{ color: 'green' }}>{successMessage}</p>}
                        {errorMessage && <p className="font-montserrat text-lg 
                        leading-8 mt-6 mb-14"
                            style={{ color: 'red' }}>{errorMessage}</p>}
                        <form  className="flex flex-col justify-center items-center m-10 rounded-lg 
                        bg-white px-6 py-8 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleSubmit}>
                            <label className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-14"
                            >
                            Manga Name: <span> </span>
                            <input className="gap-5 p-2.5 my-2
                            sm:border sm:border-slate-gray 
                            rounded-full"
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} />
                            </label>
                            <label className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-14"
                            >
                            Select Cover Image: <span> </span>
                            <input  className='input'
                                type="file" 
                                onChange={handleFileChange}
                             />
                            </label>
                            <button className="gap-2 px-7 py-4 my-2 border 
                            font-montserrat text-lg leading-none bg-black
                            rounded-full text-white border-black"
                                type="submit"
                            >
                                Upload Manga
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5"
                    >
                        <h2  className="text-3xl leading-[68px] 
                         font-palanquin font-bold"
                        >
                            Manga Chapter
                        </h2>
                        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                        <div className="flex flex-col justify-center items-center m-5 rounded-lg 
                        bg-white px-6 py-8 shadow-xl
                        ring-slate-900/5"
                        >
                            <ul>
                                {mangas.map((manga)=>
                                    <li key={manga._id}>
                                        <button  className="text-white px-4 py-2 text-sm
                                        font-montserrat font-medium mt-8 mx-5
                                        bg-slate-gray rounded-md "
                                            onClick={()=> {
                                            setMangaID(manga._id)
                                            setMangaName(manga.name)
                                        }}>
                                            {manga.name}
                                        </button>
                                    </li>
                                )}
                            </ul>
                            <p className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-14"
                            >
                                Upload to: {mangaName}
                            </p>
                        </div>
                        <form  className="flex flex-col justify-center m-10 rounded-lg 
                        bg-white px-6 py-8 shadow-xl
                        ring-slate-900/5"
                            onSubmit={handleChapterSubmit}
                        >
                            <label  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-5"
                            >
                                Chapter Number:
                                <input className="gap-5 p-2.5 my-5
                                sm:border sm:border-slate-gray 
                                rounded-full"
                                type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} />
                            </label>
                            <label className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-5"
                            >
                                Title:
                                <input className="gap-5 p-2.5 my-5
                                sm:border sm:border-slate-gray 
                                rounded-full"
                                type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </label>
                            <label  className="font-montserrat 
                            text-slate-gray text-lg 
                            leading-8 mt-6 mb-5"
                            >
                                Select Pages:
                                <input type="file" multiple onChange={handleFilesChange} />
                            </label>
                            <button className="gap-2 px-7 py-4 my-2 border 
                            font-montserrat text-lg leading-none bg-black
                            rounded-full text-white border-black"
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
      <div>
          {currentLocation === "/manager/delete/manga" ? (
              <div>
                    <ul>
                        {mangas.map((manga)=> {
                            return (
                                <>
                                    <li 
                                        onClick={()=> {
                                            handleMangaClick(manga._id, manga.name )
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
                    <p>Type "{selectedMangaName}" to delete Manga</p>
                    <input onChange={(e)=> {setDeleteMangaName(e.target.value)}} placeholder="Manga Name" value={deleteMangaName}></input>
                    <button onClick={handleDeleteMangaClick}>
                        Delete Manga
                    </button>
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
                    <p>Type "{selectedChapterTitle}" to delete Chapter</p>
                    <input onChange={(e)=> {setDeleteChapterTitle(e.target.value)}} placeholder="Chapter Title" value={deleteChapterTitle}></input>
                    <button onClick={handleDeleteChapterClick}>
                        Delete Chapter
                    </button>
              </div>
          )
      }
          
         
      </div>
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
      <div>
          {currentLocation === "/manager/edit/manga" ? (
              <div>
                  <ul>
                      {mangas.map((manga)=> {
                          return (
                              <li key={manga._id}>
                                  <button onClick={()=> {
                                      handleMangaClick(manga.name, manga._id)
                                  }}>
                                      {manga.name}
                                  </button>
                              </li>
                          )
                      })}
                  </ul>
                  <h3>Update: {mangaName}</h3>
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <form onSubmit={handleSubmit}>
                      <label>
                          Manga Name: 
                          <input type="text" onChange={handleChange} value={newMangaName} placeholder={mangaName}/>
                      </label>
                      <label>
                          Select Cover Image:
                          <input type="file" onChange={handleFileChange}/>
                      </label>
                      <button  type="submit"> Update Manga </button>
                  </form>
              </div>
          ) : (
          <div>
              <ul> 
                  {mangas.map((manga)=> {
                      return (
                      <div key={manga._id}>
                          <li>
                              <button
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
                                                  <button onClick={()=> {
                                                      handleChapterClick(chapter.title, chapter.chapterNumber, chapter._id)
                                                  }}>
                                                    Chapter {chapter.chapterNumber}: {chapter.title}
                                                  </button>
                                              </li>
                                          ))
                                      )}
                              </ul>
                          </li>
                          
                      </div>
                      )
                  })}
              </ul>
              <div>
                  <h3>Manga: {mangaName}</h3>
                  <p>Update {chapterTitle} Chapter.</p>
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <form onSubmit={handleChapterSubmit}>
                      <label>
                      Chapter Number:
                      <input type="number" value={newChapterNumber} onChange={(e) => setNewChapterNumber(e.target.value)} placeholder={chapterNumber} />
                      </label>
                      <label>
                      Title:
                      <input type="text" value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} placeholder={chapterTitle}/>
                      </label>
                      <label>
                      Select Pages:
                      <input type="file" multiple onChange={handleFilesChange} />
                      </label>
                      <button type="submit">Update Chapter</button>
                  </form>
              </div>
          </div>
          )}
      </div>
  )
};



export default Manager;

export {Create, Delete, Edit};