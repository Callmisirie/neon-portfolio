import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie"; 
import { useNavigate } from "react-router-dom"; 

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
        <section className="xl:padding-l wide:padding-r padding-b">
            <section className="w-full flex 
            xl:flex-row flex-col justify-center 
            min-h-screen gap-10 max-container"
            >
                <div className="flex flex-col m-10 rounded-lg 
                    bg-white px-6 py-8 shadow-xl
                    ring-slate-900/5 "
                >
                    <button 
                        className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium mt-8 mx-5
                        bg-purple-600 rounded-md "
                        onClick={ ()=> {
                        handleClick("Register")
                    }}>
                        Register
                    </button>    
                    <button
                        className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium mt-8 mx-5
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
            className="flex flex-col justify-center items-center m-10 rounded-lg 
            bg-white px-6 py-8 shadow-xl
            ring-slate-900/5"
            onSubmit={handleRegisterSubmit}
        >
            <h2 className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 mt-6 mb-14"
            >
                Register
            </h2>
            <input 
                className="w-full flex items-center 
                gap-5 p-2.5 my-2
                sm:border sm:border-slate-gray 
                rounded-full"
                onChange={handleOnChange}
                name="username"
                value={registerInfo.username}
                placeholder="Username"
                type="text"
            />
            <input 
                className="w-full flex items-center 
                gap-5 p-2.5 my-2
                sm:border sm:border-slate-gray 
                rounded-full"
                onChange={handleOnChange}
                name="password"
                value={registerInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button 
                className="gap-2 px-7 py-4 my-2 border 
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
            className="flex flex-col justify-center items-center m-10 rounded-lg 
            bg-white px-6 py-8 shadow-xl
            ring-slate-900/5"
            onSubmit={handleLoginSubmit}
        >
            <h2 className="font-montserrat 
                text-slate-gray text-lg 
                leading-8 mt-6 mb-14"
            >
                Login
            </h2>
            <input 
                className="w-full flex items-center 
                gap-5 p-2.5 my-2
                sm:border sm:border-slate-gray 
                rounded-full"
                onChange={handleOnChange}
                name="username"
                value={loginInfo.username}
                placeholder="Username"
                type="text"
            />
            <input 
                className="w-full flex items-center 
                gap-5 p-2.5 my-2
                sm:border sm:border-slate-gray 
                rounded-full"
                onChange={handleOnChange}
                name="password"
                value={loginInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button
                className="gap-2 px-7 py-4 my-2 border 
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