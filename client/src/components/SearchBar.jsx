import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../assets/icons"

function SearchBar() {
    const navigate = useNavigate();
    const [mangaName, setMangaName] = useState();

    const handleClick = async (e) => {
        e.preventDefault();
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
            <form className="flex justify-center items-center p-1 my-2
                border rounded-md border-slate-gray hover:border-black" >
                <button className="flex justify-center mx-1"
                onClick={handleClick} type="submit" value="">
                    <img className="m-1 rounded-full w-5 h-5"
                    src={search} 
                    alt="search icon"/>
                </button>
                <input className="p-1
                rounded-xl input font-montserrat w-fit"
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