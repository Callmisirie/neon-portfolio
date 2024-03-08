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
                setIsClickedRegister(false)
            } else if (!isClickedRegister) {
                setIsClickedRegister(true)
                setIsClickedLogin(false)
            }
        }
        else if (auth === "Login") {
            if (isClickedLogin) {
                setIsClickedLogin(false)
            } else if (!isClickedLogin) {
                setIsClickedLogin(true)
                setIsClickedRegister(false)
            }
        } 
    }

    return (
        <div className="auth">
            <button onClick={ ()=> {
                handleClick("Register")
            }}>Register</button>
            <button onClick={()=> {
                handleClick("Login")
            }}>Login</button>
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
        <form onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            <input 
                onChange={handleOnChange}
                name="username"
                value={registerInfo.username}
                placeholder="Username"
                type="text"
            />
            <input 
                onChange={handleOnChange}
                name="password"
                value={registerInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button type="submit">Register</button>
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
        <form onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <input 
                onChange={handleOnChange}
                name="username"
                value={loginInfo.username}
                placeholder="Username"
                type="text"
            />
            <input 
                onChange={handleOnChange}
                name="password"
                value={loginInfo.password}
                placeholder="Password" 
                type="password" 
            />
            <button type="submit">Login</button>
        </form>
    )
};


export default Auth;