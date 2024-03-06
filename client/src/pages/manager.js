import { useNavigate } from 'react-router-dom';



function Manager() {

  const navigate = useNavigate();

  function handleNewManga() {
    navigate("/manager/newManga")
  };

  function handleUploadChapter() {
    navigate("/manager/existingManga")
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
    <div>
      <div>
        <h2>Create</h2>
        <button onClick={handleNewManga}> Manga</button>
        <button onClick={handleUploadChapter}> Chapter</button>
      </div>
    
      <div>
        <h2>Delete</h2>
        <button onClick={handleDeleteManga}> Manga</button>
        <button onClick={handleDeleteChapter}> Chapter</button>
      </div>

      <div>
        <h2>Edit</h2>
        <button onClick={handleEditManga}> Manga</button>
        <button onClick={handleEditChapter}> Chapter</button>
      </div>
    
    </div>
 
  )
  
};
{/* 
function Management({action, firstButton, secondButton}) {
  <div>
    <h2>Create</h2>
    <button onClick={handleNewManga}> New Manga</button>
    <button onClick={handleExistingManga}> Existing Manga</button>
  </div>
} */}

export default Manager;