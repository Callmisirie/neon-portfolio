import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";


function Edit() {

    
    const [mangas, setMangas] = useState([]);
    const [mangaID, setMangaID] = useState("");
    const [mangaContents, setMangaContents] = useState([]);
    const [clickedMangaId, setClickedMangaId] = useState(null);
    const [mangaName, setMangaName] = useState("");
    const [newMangaName, setNewMangaName] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    

    const [coverImage, setCoverImage] = useState("");
  

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

    const handleMangaClick = (name, id) => {
        setMangaName(name);
        setMangaID(id);
    }

    const handleChange = (e) => {
        setNewMangaName(e.target.value);
    }
    
    const handleFileChange = (e) => {
        const files = e.target.files;
        setCoverImage(...files);
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
                        UPDATE Chapter
                    </div>
                )}
        </div>
    )

};


export default Edit;