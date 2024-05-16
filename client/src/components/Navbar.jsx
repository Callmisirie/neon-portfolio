import {hamburger, hamburgerCancel} from "../assets/icons"
import {headerLogoPurple} from "../assets/images"

import { Link } from "react-router-dom"; 
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import SearchBar from "../components/SearchBar.jsx";

function Navbar() {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [userCookies, setUserCookies] = useCookies(["userAccess_token"]);
    const Navigate = useNavigate();
    const location = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false)



    
    
    function Logout() {
        setCookies("access_token", null);
        setUserCookies("userAccess_token", null);
        window.localStorage.removeItem("adminAccess_token");
        window.localStorage.removeItem("userAccess_token");
        window.localStorage.removeItem("adminUserID");
        window.localStorage.removeItem("userID");
        Navigate("/");
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("adminAccess_token");
        const userAccessToken =  localStorage.getItem("userAccess_token");
    
        if (accessToken) {
            setCookies("access_token", accessToken);
            localStorage.setItem("adminAccess_token", accessToken);
        } else {
            setCookies("access_token", null);
            localStorage.removeItem("adminAccess_token");
        }
    
        if (userAccessToken) {
            setUserCookies("userAccess_token", userAccessToken);
            localStorage.setItem("userAccess_token", userAccessToken);
        } else {
            setUserCookies("userAccess_token", null);
            localStorage.removeItem("userAccess_token");
        }
    }, [cookies, userCookies]);
    
     

    const mangaPath = "/manga"
    const commissionPath = "/commission"
    const contactPath = "/contact"
    const aboutPath = "/about"
    const managerPath = "/manager"
    const authUserPath = "/auth/user"

    return (   
        <header className="padding-x 
        border-b bg-white top-0 py-2 
        z-50 w-full sticky">
            <nav className="flex justify-between max-xl:flex-col items-center max-container">  
                <div className="flex justify-between items-center w-full max-container">
                    <a href="/">
                        <img className="flex min-w-20 w-20"
                        src={headerLogoPurple}
                        alt="Logo"
                       />
                    </a>
                    <ul className="flex-1 flex justify-between items-center gap-4 max-xl:hidden mx-10">
                        <li> 
                            <SearchBar /> 
                        </li>
                        <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-slate-gray 
                        ${location.pathname === "/" ? "font-semibold" : " "}`}><Link to="/"> 
                            Home </Link>
                        </li>                        
                        <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-slate-gray
                        ${location.pathname.slice(0, mangaPath.length) === "/manga" ? "font-semibold" : " "}`}><Link to="/manga"> 
                            Manga </Link>
                        </li>                       
                
                        <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-slate-gray
                        ${location.pathname.slice(0, commissionPath.length) === "/commission" ? "font-semibold" : " "}`}><Link to="/commission">
                            Commission </Link>
                        </li>                                   
                        {/* <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-slate-gray
                            ${location.pathname.slice(0, aboutPath.length) === "/about" ? "font-semibold" : " "}`}><Link to="/about">
                                About </Link>
                            </li>                    
                        </div> */}               
                        <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-slate-gray
                        ${location.pathname.slice(0, contactPath.length) === "/contact" ? "font-semibold" : " "}`}><Link to="/contact">
                            Contact </Link>
                        </li>                                 
                        <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-black
                        ${location.pathname.slice(0, authUserPath.length) === "/auth/user" ? "font-semibold" : " "}`}><Link to="/auth/user"> 
                            Sign in / Register </Link>
                        </li>                                     
                        {cookies.access_token || userCookies.userAccess_token ?  (
                            <div className="flex justify-center gap-10 items-center pl-5">
                                {cookies.access_token ? (
                                    <li className={`font-montserrat leading-normal text-center text-sm hover:text-purple-600 text-black
                                    ${location.pathname.slice(0, managerPath.length) === "/manager" ? "font-semibold" : " "}`}><Link to="/manager"> 
                                        Manager </Link>
                                    </li>                                                
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
                    <div className="hidden max-xl:block">
                        <img className="cursor-pointer" 
                        src={!openNavigation ? hamburger : hamburgerCancel}
                        alt="Hamburger"
                        width={25}
                        height={25}
                        onClick={() => {
                            setOpenNavigation(!openNavigation)
                        }}
                        />
                    </div>
                </div>   


                {openNavigation ? (
                    <ul className="flex-1 flex-col justify-center items-center gap-4 xl:hidden my-5">
                        <li className="flex justify-center mb-5 items-center"> 
                            <SearchBar 
                                setOpenNavigation={setOpenNavigation}
                                openNavigation={openNavigation}
                                /> 
                        </li>
                        <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-slate-gray
                            ${location.pathname === "/" ? "font-semibold" : " "}`}
                                onClick={() => {
                                    setOpenNavigation(!openNavigation)
                                }}
                            ><Link to="/"> 
                                Home </Link>
                            </li>                        
                        </div>
                        <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-slate-gray
                            ${location.pathname.slice(0, mangaPath.length) === "/manga" ? "font-semibold" : " "}`}
                            onClick={() => {
                                setOpenNavigation(!openNavigation)
                            }}
                            ><Link to="/manga"> 
                                Manga </Link>
                            </li>                       
                        </div>
                        <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-slate-gray
                            ${location.pathname.slice(0, commissionPath.length) === "/commission" ? "font-semibold" : " "}`}
                            onClick={() => {
                                    setOpenNavigation(!openNavigation)
                                }}                            
                            ><Link to="/commission">
                                Commission </Link>
                            </li>                
                        </div>
                        {/* <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-slate-gray
                            ${location.pathname.slice(0, aboutPath.length) === "/about" ? "font-semibold" : " "}`}><Link to="/about">
                                About </Link>
                            </li>                    
                        </div> */}
                        <div className="w-full"> 
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-slate-gray
                            ${location.pathname.slice(0, contactPath.length) === "/contact" ? "font-semibold" : " "}`}
                            onClick={() => {
                                setOpenNavigation(!openNavigation)
                            }}                            
                            ><Link to="/contact">
                                Contact </Link>
                            </li>                   
                        </div>
                        <div className="w-full">
                            <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-black
                            ${location.pathname.slice(0, authUserPath.length) === "/auth/user" ? "font-semibold" : " "}`}
                            onClick={() => {
                                setOpenNavigation(!openNavigation)
                            }}                      
                            ><Link to="/auth/user"> 
                                Sign in / Register </Link>
                            </li>                  
                        </div>
                        {cookies.access_token || userCookies.userAccess_token ?  (
                            <div className="flex justify-center flex-col items-center mt-10 w-full">
                                {cookies.access_token ? (
                                    <div className="w-full">
                                        <li className={`font-montserrat leading-normal text-center text-sm mb-5 hover:text-purple-600 text-black
                                        ${location.pathname.slice(0, managerPath.length) === "/manager" ? "font-semibold" : " "}`}
                                        onClick={() => {
                                            setOpenNavigation(!openNavigation)
                                        }}
                                        ><Link to="/manager"> 
                                            Manager </Link>
                                        </li>                  
                                    </div>                               
                                ) : null}
                                <li className="font-montserrat leading-normal text-sm hover:text-slate-gray text-black">
                                    <button
                                        className="gap-2 px-6 py-4 border 
                                        font-montserrat text-sm leading-none bg-black
                                        rounded-full text-white border-black"
                                        onClick={() => {
                                            Logout()   
                                            setOpenNavigation(!openNavigation) 
                                        }}> 
                                        Logout 
                                    </button>
                                </li> 
                            </div>         
                        ) : null}
                    </ul>                    
                ) : null}


            </nav>   
        </header>
    )
};
  
export default Navbar;