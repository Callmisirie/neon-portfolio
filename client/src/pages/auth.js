import { useState } from "react";
import axios from "axios";

function Auth() {
    return (
        <div className="auth">
            <Register />
            <Login />
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

        const response = await axios.post(
            "http://localhost:4001/auth/register",
            registerInfo
        );
        console.log(response);
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

        const response = await axios.post(
            "http://localhost:4001/auth/login",
            loginInfo
        );
        console.log(response);
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