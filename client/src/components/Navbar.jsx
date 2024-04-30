import {hamburger} from "../assets/icons"
import {headerLogoPurple} from "../assets/images"

import { Link } from "react-router-dom"; 
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from "react-router-dom";


import SearchBar from "../components/SearchBar.jsx";

function Navbar() {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [userCookies, setUserCookies] = useCookies(["userAccess_token"]);
    const Navigate = useNavigate();
    const location = useLocation();

    function Logout() {
        setCookies("access_token", "");
        setUserCookies( "userAccess_token", "");
        window.localStorage.removeItem("adminUserID")
        window.localStorage.removeItem("userID")
        Navigate("/");
    };

    const path = "/manga"

    const pathLength = path.length


    return (   
        <header className={`padding-x 
        border-b bg-white-400 top-0 py-2 
        z-50 w-full ${location.pathname.slice(0, 6) === "/manga" ? "" : "sticky"}`}>
            <nav className="flex justify-between items-center max-container">     
                <a href="/">
                    <img className=""
                    src={headerLogoPurple}
                    alt="Logo"
                    width={90}
                    height={20}/>
                </a>
                
                <ul className="flex-1 flex justify-center items-center gap-10 max-lg:hidden mx-10">
                    <li> <SearchBar /> </li>
                    <li className="font-montserrat leading-normal text-sm hover:text-black text-slate-gray"><Link to="/"> Home </Link></li>
                    <li className="font-montserrat leading-normal text-sm hover:text-black text-slate-gray"><Link to="/manga"> Manga </Link></li>
                    <li className="font-montserrat leading-normal text-sm hover:text-black text-slate-gray"><Link to="/commission"> Commission </Link></li>
                    <li className="font-montserrat leading-normal text-sm hover:text-black text-slate-gray"><Link to="/about"> About </Link></li>
                    <li className="font-montserrat leading-normal text-sm hover:text-black text-slate-gray"><Link to="/contact"> Contact </Link></li>
                    <li className="font-montserrat leading-normal text-sm hover:text-slate-gray text-black"><Link to="/auth/user"> Sign in / Register </Link></li>
                    {cookies.access_token || userCookies.userAccess_token ?  (
                        <div className="flex justify-center gap-16 items-center ml-10 px-5">
                            {cookies.access_token ? (
                                <li className="font-montserrat leading-normal text-sm hover:text-slate-gray text-black"><Link to="/manager"> Manager </Link></li> 
                            ) : null}
                            <li className="font-montserrat leading-normal text-sm hover:text-slate-gray text-black">
                                <button
                                    className="gap-2 px-6 py-4 border 
                                    font-montserrat text-sm leading-none bg-black
                                    rounded-full text-white border-black"
                                    onClick={Logout}> 
                                    Logout 
                                </button>
                            </li> 
                        </div>         
                    ) : null}
                </ul>
                <div className="hidden max-lg:block">
                    <img 
                    src={hamburger}
                    alt="Hamburger"
                    width={25}
                    height={25}/>
                </div>
            </nav>   
        </header>
    )
};
  
export default Navbar;