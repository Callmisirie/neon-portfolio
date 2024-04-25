import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie"; 
import { useNavigate } from "react-router-dom"; 
import { hideView, showView } from "../assets/icons";

function UserAuth() {
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
            <section className="min-h-full flex flex-col items-center">
                <div className="flex 
                flex-col justify-center items-center  
                max-container m-10 rounded-lg 
                bg-white px-6 py-8 shadow-xl
                ring-slate-900/5">
                    <h2  className="text-3xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold p-2 text-center">
                        USER AUTH
                    </h2>
                    <button className="text-white px-4 py-2 text-sm
                        font-montserrat font-medium my-3 mx-5
                        bg-purple-600 rounded-md hover:bg-purple-500 "
                        onClick={ ()=> {
                        handleClick("Register")
                    }}>
                        Register
                    </button>    
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-5
                    bg-purple-400 rounded-md hover:bg-purple-300 " 
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

    );
};

export function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [registerInfo, SetRegisterInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Register");

    function handleOnChange(event){
        const {value, name} = event.target;
        
        SetRegisterInfo((preValue)=> 
           ( {
                ...preValue,
                [name]: value
            })
        )
        setMessage("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        
        setActionMessage("Processing");
        setIsDisabled(true);

        SetRegisterInfo({
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        });

        try {
            const response = await axios.post("http://localhost:4001/auth/user/register", registerInfo);
            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setIsDisabled(false);
            setActionMessage("Register");

        } catch (error) {
            setMessage("Error registering user");
            setMessageColor("red");
            setIsDisabled(false);
            setActionMessage("Register");
            console.error(error)
        }

    };

    return (
        <form className="flex flex-col justify-center items-center rounded-lg 
        bg-white px-6 py-6 shadow-xl
        ring-slate-900/5"
        onSubmit={handleRegisterSubmit}>
            <h2 className="font-montserrat 
            text-slate-gray text-lg 
            leading-8 my-2 font-bold">
                Register
            </h2>
            {message && <p className="font-montserrat text-lg 
            leading-8 my-2"  style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <input className="w-full flex
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat"
            onChange={handleOnChange}
            name="firstName"
            value={registerInfo.firstName}
            placeholder="First Name"
            type="text"
            autoComplete="off"/>
            <input className="w-full flex
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat"
            onChange={handleOnChange}
            name="lastName"
            value={registerInfo.lastName}
            placeholder="Last Name"
            type="text"
            autoComplete="off"/>
            <input className="w-full flex
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat"
            onChange={handleOnChange}
            name="email"
            value={registerInfo.email}
            placeholder="Email"
            type="email"
            autoComplete="off"/>
            <div className="w-full flex 
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat">
                <div className="mr-1 ml-2 
                rounded-full w-5 h-5"/>
                <input className="appearance-none 
                outline-none text-center"
                onChange={handleOnChange}
                name="password"
                value={registerInfo.password}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                minLength="8"/>
                <img className="ml-1 mr-2 
                rounded-full w-5 h-5 cursor-pointer"
                onClick={togglePasswordVisibility}
                src={showPassword ? showView : hideView}/>
            </div>   
            <button className="px-7 py-4 my-2 border 
            font-montserrat text-lg leading-none bg-black
            rounded-full text-white border-black"
            type="submit"
            disabled={isDisabled}>
                {actionMessage}
            </button>
        </form>
    )
};


export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginInfo, SetLoginInfo] = useState({
        email: "",
        password: ""
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Login");

    const [ , setCookies] = useCookies(["userAccess_token"]);
    const navigate = useNavigate();

    function handleOnChange(event){
        const {value, name} = event.target;
        
        SetLoginInfo((preValue)=> 
           ( {
                ...preValue,
                [name]: value
            })
        );
        setMessage("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        setIsDisabled(true);
        setActionMessage("Processing...");
        
        SetLoginInfo({
            email: "",
            password: ""
        });

        try {
            const response = await axios.post("http://localhost:4001/auth/user/login", loginInfo);
            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setActionMessage("Login");
            setIsDisabled(false);
            if (response.data.token === undefined) {
                setCookies("userAccess_token",  null);
            }else {
                setCookies("userAccess_token",  response.data.token);
            }
            window.localStorage.setItem("userAccess_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            if (response.data.token) {
                navigate("/")
            }
        } catch (error) {
            setMessage("Error logging in user");
            setMessageColor("red");
            setActionMessage("Login");
            setIsDisabled(false);
            console.error(error)
        }
    };

    return (
        <form className="flex flex-col justify-center items-center rounded-lg 
        bg-white px-6 py-6 shadow-xl
        ring-slate-900/5"
        onSubmit={handleLoginSubmit}>
            <h2 className="font-montserrat 
            text-slate-gray text-lg 
            leading-8 my-2 font-bold">
                Login
            </h2>
            {message && <p className="font-montserrat text-lg 
            leading-8 my-2"  style={{ color:`${messageColor}`}}>
                {message}
            </p>}
            <input className="w-full flex 
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat"
            onChange={handleOnChange}
            name="email"
            value={loginInfo.email}
            placeholder="Email"
            type="email"
            autoComplete="off"/>
            <div className="w-full flex 
            items-center p-2.5 my-2
            border border-slate-gray 
            rounded-full text-center font-montserrat">
                <div className="mr-1 ml-2 
                rounded-full w-5 h-5"/>
                <input className="appearance-none 
                outline-none text-center"
                onChange={handleOnChange}
                name="password"
                value={loginInfo.password}
                placeholder="Password" 
                type={showPassword ? 'text' : 'password'}
                minLength="8"
                />
                <img className="ml-1 mr-2 
                rounded-full w-5 h-5 cursor-pointer"
                onClick={togglePasswordVisibility}
                src={showPassword ? showView : hideView}/>
            </div>
            <button className="px-7 py-4 my-2 border 
            font-montserrat text-lg leading-none bg-black
            rounded-full text-white border-black" 
            type="submit"
            disabled={isDisabled}>
                {actionMessage}
            </button>
        </form>
    )
};


export default UserAuth;