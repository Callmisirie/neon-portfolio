import React, { useState, useEffect } from "react";
import axios from "axios";




function ExistingManga() {
    const [mangas, setMangas] = useState([]);

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


    const [chapterNumber, setChapterNumber] = useState("");
    const [title, setTitle] = useState("")
    const [mangaID, setMangaID] = useState("")
    const [mangaName, setMangaName] = useState("")


    const [pages, setPages] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        const files = e.target.files;
        setPages([...pages, ...files]);
    };

    const handleSubmit = async (e) => {
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
      <form onSubmit={handleSubmit}>
        <label>
          Chapter Number:
          <input type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} />
        </label>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Select Pages:
          <input type="file" multiple onChange={handleFileChange} />
        </label>
        <button type="submit">Upload Chapter</button>
      </form>
    </div>
  );
};


export default  ExistingManga;