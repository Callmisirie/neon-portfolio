import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Find() {
    const location = useLocation();
    const navigate = useNavigate();
    const [foundMangas, setFoundMangas] = useState([]);

    useEffect(()=> {
        const fetchManga = async ()=> {
            try {
                const response = await axios.get(`http://localhost:4001${location.pathname}`);
                setFoundMangas(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchManga();
    }, [foundMangas]);

    function handleClick(id) {
        navigate("/manga/" + id)
    }

   return (
    <section className="min-h-full">
        <div  className=" flex flex-col items-center rounded-lg
          bg-white px-6">
            <h2 className="text-3xl leading-[68px] 
              lg:max-w-md font-palanquin font-bold p-2 text-center">
              Manga result
            </h2>
            {foundMangas && (
                foundMangas.map((manga)=> {
                    return (
                        <div className="flex flex-col justify-center items-center rounded-lg 
                        bg-white p-6 shadow-xl mb-10
                        ring-slate-900/5"
                        key={manga._id}>
                            <h3 className="font-montserrat 
                            text-slate-gray hover:text-black text-md max-w-xs
                            leading-8 my-2 cursor-pointer w-full text-center hover:font-semibold"
                            onClick={()=> {
                            handleClick(manga._id)
                            }}>
                                {manga.name}
                            </h3>
                            <img className="flex flex-col justify-center rounded-xl m-5 shadow-xl"
                            src={`http://localhost:4001/display/${manga._id}`} 
                            alt={`Manga ${manga.coverImage}`} 
                            style={{ width: "160px" }}/>
                        </div>
                    )
                })
            )}
        </div>
    </section>
    
   ) 
}


export default Find;