import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie"; 
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';

function Auth() {
    const [isClickedRegister, setIsClickedRegister] = useState(false);
    const [isClickedLogin, setIsClickedLogin] = useState(false);


    function handleClick(auth) {
        if (auth === "Register") { 
            if (isClickedRegister) {
                setIsClickedRegister(false);
            } else if (!isClickedRegister) {
                setIsClickedRegister(true);
                setIsClickedLogin(false);
            }
        }
        else if (auth === "Login") {
            if (isClickedLogin) {
                setIsClickedLogin(false);
            } else if (!isClickedLogin) {
                setIsClickedLogin(true);
                setIsClickedRegister(false);
            }
        } 
    }

    return (
        <section className="relative">
            <section className="min-h-screen flex flex-col items-center">
            <Navbar/> 
                <div className="h-full flex 
                flex-col justify-center items-center  
                max-container m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5"
                >
                    <button 
                        className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md "
                        onClick={ ()=> {
                        handleClick("Register")
                    }}>
                        Register
                    </button>    
                    <button
                        className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-400 rounded-md " 
                        onClick={()=> {
                        handleClick("Login")
                    }}>
                        Login
                    </button>
                    {isClickedRegister && 
                        <>
                            <Register /> 
                        </> 
                    }
                    {isClickedLogin && 
                        <>
                            <Login /> 
                        </> 
                    }
                </div>  
            </section>
            <Footer />
        </section>

    );
};

export function Register() {
    const [registerInfo, SetRegisterInfo] = useState({
        username: "",
        password: ""
    });

    function handleOnChange(event){
        const {value, name} = event.target;
        
        SetRegisterInfo((preValue)=> 
           ( {
                ...preValue,
                [name]: value
            })
        )
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        SetRegisterInfo({
            username: "",
            password: ""
        });
        try {
                 await axios.post(
                "http://localhost:4001/auth/register",
                registerInfo
            );
        } catch (error) {
            console.error(error)
        }

    };

    return (
        <form 
            className="flex flex-col justify-center items-center rounded-lg 
            bg-white px-6 py-6 shadow-xl
            ring-slate-900/5"
            onSubmit={handleRegisterSubmit}
        >
            <h2 className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-2 font-bold"
            >
                Register
            </h2>
            <input 
                className="w-full flex
                items-center p-2.5 my-2
                border border-slate-gray 
                rounded-full text-center font-montserrat"
                onChange={handleOnChange}
                name="username"
                value={registerInfo.username}
                placeholder="Username"
                type="text"
                autoComplete="off"
            />
            <input 
                className="w-full flex 
                items-center p-2.5 my-2
                border border-slate-gray 
                rounded-full text-center font-montserrat"
                onChange={handleOnChange}
                name="password"
                value={registerInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button 
                className="px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black"
            
                type="submit"
            >
                Register
            </button>
        </form>
    )
};


export function Login() {
    const [loginInfo, SetLoginInfo] = useState({
        username: "",
        password: ""
    });

    const [ , setCookies] = useCookies(["access_token"]);

    const navigate = useNavigate();

    function handleOnChange(event){
        const {value, name} = event.target;
        
        SetLoginInfo((preValue)=> 
           ( {
                ...preValue,
                [name]: value
            })
        );
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        
        SetLoginInfo({
            username: "",
            password: ""
        });

        try {
            const response = await axios.post(
                "http://localhost:4001/auth/login",
                loginInfo
            );
            setCookies("access_token",  response.data.token);
            window.localStorage.setItem("adminUserID", response.data.adminUserID);
            navigate("/manager")
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <form 
            className="flex flex-col justify-center items-center rounded-lg 
            bg-white px-6 py-6 shadow-xl
            ring-slate-900/5"
            onSubmit={handleLoginSubmit}
        >
            <h2 className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 my-2 font-bold"
            >
                Login
            </h2>
            <input 
                className="w-full flex 
                items-center p-2.5 my-2
                border border-slate-gray 
                rounded-full text-center font-montserrat"
                onChange={handleOnChange}
                name="username"
                value={loginInfo.username}
                placeholder="Username"
                type="text"
                autoComplete="off"
            />
            <input 
                className="w-full flex 
                items-center p-2.5 my-2
                border border-slate-gray 
                rounded-full text-center font-montserrat"
                onChange={handleOnChange}
                name="password"
                value={loginInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button
                className="px-7 py-4 my-2 border 
                font-montserrat text-lg leading-none bg-black
                rounded-full text-white border-black" 
                type="submit"
            >
                Login
            </button>
        </form>
    )
};


export default Auth;