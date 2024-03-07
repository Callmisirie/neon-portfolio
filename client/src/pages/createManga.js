import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';



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
            await axios.post("http://localhost:4001/manga", formData, {
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
        await axios.post("http://localhost:4001/chapterContent", formData, {
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
    <div>
        {currentLocation === "/manager/create/manga" ? (
            <div> 
                <h2>Upload Manga</h2>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                    Manga Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                    Select Cover Image:
                    <input type="file" onChange={handleFileChange}/>
                    </label>
                    <button type="submit">Upload Manga</button>
                </form>
            </div>
        ) : (
            <div>
                <h2>Upload Manga Chapter</h2>
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <div>
                    <ul>
                        {mangas.map((manga)=>
                            <li key={manga._id}>
                                <button onClick={()=> {
                                    setMangaID(manga._id)
                                    setMangaName(manga.name)
                                }}>
                                    {manga.name}
                                </button>
                            </li>
                        )}
                    </ul>
                    <p>Upload To: {mangaName}</p>
                </div>
                <form onSubmit={handleChapterSubmit}>
                    <label>Chapter Number:
                        <input type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} />
                    </label>
                    <label>Title:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label>Select Pages:
                        <input type="file" multiple onChange={handleFilesChange} />
                    </label>
                    <button type="submit">Upload Chapter</button>
                </form>
            </div>
        )
        }
        
    </div>
  );
};


export default Create;