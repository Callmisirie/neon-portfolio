import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie"; 
import { useNavigate } from "react-router-dom"; 


function GenerateOTP() {
    const [generateOTPInfo, SetGenerateOTPInfo] = useState({
        id: "",
        code: ""
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("confirm Code");

    const navigate = useNavigate();

    function handleOnChange(event){
        const {value, name} = event.target;
        
        SetGenerateOTPInfo((preValue)=> 
           ( {
                ...preValue,
                [name]: value
            })
        );
        setMessage("");
    };

    const handleGenerateOTP = async () => {
        try {
            const response = await axios.post("https://app.callmineon.com/passwordReset/generateOTP", generateOTPInfo);
            const {message, color} = response.data;
            setMessage(message);
            setMessageColor(color);
            setTimeout(() => {
                setMessage("");  
            }, 5000);
        } catch (error) {
            setMessage("Error generating OTP");
            setMessageColor("red");
            
        }
    }

    const handleGenerateOTPInfoSubmit = async (event) => {
        event.preventDefault()
        setIsDisabled(true);
        setActionMessage("Processing...");

        if (generateOTPInfo.id && generateOTPInfo.code){
            try {
                const response = await axios.post("https://app.callmineon.com/passwordReset/confirmOTP", generateOTPInfo);
                const {message, color, isMatch} = response.data;
                setMessage(message);
                setMessageColor(color);
                setActionMessage("confirm Code");
                setIsDisabled(false);
                if(isMatch) {
                    navigate("/passwordReset/changePassword")
                }
                window.localStorage.removeItem("generateOTPInfo")
                window.localStorage.setItem("generateOTPInfo",  JSON.stringify(generateOTPInfo));
            } catch (error) {
                setMessage("Error Confirming code");
                setMessageColor("red");
                setActionMessage("confirm Code");
                setIsDisabled(false);
                console.error(error)
            }            
        } else {
            setMessage("Error Confirming code, missing field");
            setMessageColor("red");
            setActionMessage("confirm Code");
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
                    Forgot Password
                </h2>
                <form className="flex flex-col justify-center items-center
                bg-white p-6"
                onSubmit={handleGenerateOTPInfoSubmit}>
                    {message && <p className="font-montserrat text-sm 
                    leading-8 my-2" style={{ color:`${messageColor}`}}>
                        {message}
                    </p>}
                    <input className="w-full flex 
                    items-center p-2.5 my-2 max-w-fit
                    border border-slate-gray 
                    rounded-full text-center font-montserrat"
                    onChange={handleOnChange}
                    name="id"
                    value={generateOTPInfo.email}
                    placeholder="Email"
                    type="email"
                    autoComplete="off"/>
                    <p className='font-montserrat leading-8
                    text-sm font-semibold text-purple-600
                    text-center cursor-pointer mb-3'
                    onClick={handleGenerateOTP}>
                        Get code
                    </p>
                    <input className="w-full flex 
                    items-center p-2.5 my-2 max-w-fit
                    border border-slate-gray 
                    rounded-full text-center font-montserrat"
                    onChange={handleOnChange}
                    name="code"
                    value={generateOTPInfo.code}
                    placeholder="Code" 
                    inputMode="numeric"
                    minLength="4"
                    autoComplete="off"/>
                    <button className={`px-7 py-4 my-2 border 
                    font-montserrat text-lg leading-none bg-black
                    rounded-full text-white border-black bg-tr
                    ${generateOTPInfo.code.length < 4 ? `cursor-not-allowed` : ``}`} 
                    type="submit"
                    disabled={generateOTPInfo.code.length < 4 ? true : isDisabled}>
                        {actionMessage}
                    </button>
                </form>
            </div>  
        </section>

    );
};




export default GenerateOTP;
