import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie"; 
import { useNavigate } from "react-router-dom"; 
import { hideView, showView } from "../../assets/icons";

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [changePasswordInfo, setChangePasswordInfo] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Confirm");
    const [generateOTPInfo, setGenerateOTPInfo] = useState(JSON.parse(window.localStorage.getItem("generateOTPInfo")));

    const navigate = useNavigate();

    function handleOnChange(event){
        const {value, name} = event.target;
        
        setChangePasswordInfo((preValue)=> 
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

    const handleGenerateOTPSubmit = async (event) => {
        event.preventDefault()
        setIsDisabled(true);
        setActionMessage("Processing...");

        console.log(changePasswordInfo);

        if (changePasswordInfo.newPassword === changePasswordInfo.confirmPassword){
            try {
                const response = await axios.post("http://app.callmineon.com/passwordReset/changePassword", {...generateOTPInfo, ...changePasswordInfo});
                const {message, color, isMatch} = response.data;
                setMessage(message);
                setMessageColor(color);
                setActionMessage("Confirm");
                setIsDisabled(false);
                if(isMatch) {
                    setChangePasswordInfo({
                        newPassword: "",
                        confirmPassword: ""
                    });
                    setTimeout(() => {
                        navigate("/auth/user")
                    }, 5000);
                    window.localStorage.removeItem("generateOTPInfo")
                    setGenerateOTPInfo(JSON.parse(window.localStorage.getItem("generateOTPInfo")))
                }
            } catch (error) {
                setMessage("Error changing password");
                setMessageColor("red");
                setActionMessage("Confirm");
                setIsDisabled(false);
                console.error(error)
            }            
        } else {
            setMessage("Error password does not match");
            setMessageColor("red");
            setActionMessage("Confirm");
            setIsDisabled(false);
        }
        

    };

    return (
        <section className="min-h-full flex flex-col items-center">
            <div className="flex 
            flex-col justify-center items-center  
            max-container m-10 rounded-lg 
            bg-white px-6 py-8 shadow-xl
            ring-slate-900/5">
                <h2  className="text-3xl leading-[68px] 
                lg:max-w-md font-palanquin font-bold p-2 text-center">
                    Change Password
                </h2>
                <form className="flex flex-col justify-center items-center 
                bg-white p-6"
                onSubmit={handleGenerateOTPSubmit}>
                    {message && <p className="font-montserrat 
                    text-sm max-w-xs text-center
                    my-2"  style={{ color:`${messageColor}`}}>
                        {message}
                    </p>}
                    <input className="w-full flex
                    items-center p-2.5 my-2 max-w-fit
                    border border-slate-gray 
                    rounded-full text-center font-montserrat"
                    onChange={handleOnChange}
                    name="newPassword"
                    value={changePasswordInfo.newPassword}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    minLength="8"
                    />
                    <input className="w-full flex
                    items-center p-2.5 my-2 max-w-fit
                    border border-slate-gray 
                    rounded-full text-center font-montserrat"
                    onChange={handleOnChange}
                    name="confirmPassword"
                    value={changePasswordInfo.confirmPassword}
                    placeholder="Confirm"
                    type={showPassword ? 'text' : 'password'}
                    minLength="8"
                    />
                    <p className="font-montserrat font-semibold
                    text-slate-gray text-start mt-2 mb-5
                    text-sm cursor-pointer"
                    onClick={togglePasswordVisibility}>
                    {!showPassword ? "Show Password" : "Hide Password"}
                    </p>
                    <button className="px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black" 
                    type="submit"
                    disabled={isDisabled}>
                        {actionMessage}
                    </button>
                </form>
            </div>  
        </section>

    );
}

export default ChangePassword