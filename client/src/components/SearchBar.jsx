import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const navigate = useNavigate();
    const [mangaName, setMangaName] = useState();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            navigate("/manga/find/" + mangaName);
            console.log(mangaName);
        } catch (error) {
            console.error(error);
        }
     
    }

    return (
        <div>
            <form >
                <input onClick={handleClick} type="submit" value="" />
                <input className="p-2.5 my-3
                border border-slate-gray 
                rounded-full text-center font-montserrat"
                    name="search" type="text" 
                    placeholder="Search" 
                    onChange={(e)=> setMangaName(e.target.value)}
                />
            </form>
        </div>
    )
}


export default SearchBar;