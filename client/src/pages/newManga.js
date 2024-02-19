import React, { useState } from 'react';
import axios from 'axios';



function NewManga() {

    const [name, setName] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const files = e.target.files;
    setCoverImage(...files);
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



    return (
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
            <input type="file" onChange={handleFileChange} name={coverImage} />
          </label>
          <button type="submit">Upload Manga</button>
        </form>
      </div>
    );
};


export default NewManga;