import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../assets/icons"

function SearchBar({setOpenNavigation, openNavigation}) {
    const navigate = useNavigate();
    const [mangaName, setMangaName] = useState("");

    const handleClick = async (e) => {
        e.preventDefault();
        
        if (openNavigation) {
            setOpenNavigation(!openNavigation)            
        }
        
        try {
            navigate("/manga/find/" + mangaName);
            setMangaName("");
            console.log(mangaName);
        } catch (error) {
            console.error(error);
            setMangaName("");
        }
     
    }

    return (
        <div className="">
            <form className="flex justify-center items-center p-1 max-w-fit
                border rounded-md border-slate-gray hover:border-black" >
                <button className="flex justify-center mx-1 w-5"
                onClick={handleClick} type="submit" value="">
                    <img className="m-1 rounded-full w-5 h-5"
                    src={search} 
                    alt="search icon"/>
                </button>
                <input className="p-1 text-sm bg-transparent
                rounded-xl input font-montserrat w-fit border-none"
                    name="search" type="search" 
                    placeholder="Manga search" 
                    autoComplete="off"
                    onChange={(e)=> setMangaName(e.target.value)}
                    value={mangaName}
                />
            </form>
        </div>
    )
}


export default SearchBar;