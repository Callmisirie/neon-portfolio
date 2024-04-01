import {hamburger} from "../assets/icons"
import {headerLogoPurple} from "../assets/images"

import { Link } from "react-router-dom"; 
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar.jsx";

function Navbar() {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const Navigate = useNavigate();

    function Logout() {
        setCookies("access_token", "");
        window.localStorage.removeItem("adminUserID")
        Navigate("/");
    };

    return (   
        <header className="padding-x absoloute py-8 z-10 w-full">
                    <nav className=" flex justify-between items-center max-container">     
                        <a href="/">
                            <img className=""
                                src={headerLogoPurple}
                                alt="Logo"
                                width={90}
                                height={20}
                            />
                        </a>
                        
                        <ul className="flex-1 flex justify-center items-center gap-16 max-lg:hidden">
                            <li> <SearchBar /> </li>
                            <li className="font-montserrat leading-normal text-lg text-slate-gray"><Link to="/"> Home </Link></li>
                            <li className="font-montserrat leading-normal text-lg text-slate-gray"><Link to="/manga"> Manga </Link></li>
                            <li className="font-montserrat leading-normal text-lg text-slate-gray"><Link to="/about"> About </Link></li>
                            <li className="font-montserrat leading-normal text-lg text-slate-gray"><Link to="/contact"> Contact </Link></li>
                            {cookies.access_token ? (
                                <>
                                    <li className="font-montserrat leading-normal text-lg text-black"><Link to="/auth"> Auth </Link></li>
                                    <li className="font-montserrat leading-normal text-lg text-black"><Link to="/manager"> Manager </Link></li> 
                                    <li className="font-montserrat leading-normal text-lg text-black">
                                        <button
                                            className="gap-2 px-7 py-4 border 
                                            font-montserrat text-lg leading-none bg-black
                                            rounded-full text-white border-black"
                                            onClick={Logout}
                                        > 
                                            Logout 
                                        </button>
                                    </li> 
                                </>         
                            ): null}
                        </ul>
                        <div className="hidden max-lg:block">
                            <img 
                                src={hamburger}
                                alt="Hamburger"
                                width={25}
                                height={25}
                            />
                        </div>
                    </nav>   
        </header>
    )
};
  
export default Navbar;