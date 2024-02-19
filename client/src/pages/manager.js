import { useNavigate } from 'react-router-dom';



function Manager() {

  const navigate = useNavigate();

  function handleNewManga() {
    navigate("/manager/newManga")
  };

  function handleExistingManga() {
    navigate("/manager/existingManga")
  };


  return (
    <div>
      <button onClick={handleNewManga}> New Manga</button>
      <button onClick={handleExistingManga}> Existing Manga</button>
    </div>
  )
  
};


export default Manager;