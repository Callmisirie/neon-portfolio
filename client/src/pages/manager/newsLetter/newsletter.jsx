import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';



//////////////////////////////////////////////////////////////////////////MANAGER//////////////////////////////////////////////////////////////////////////


function NewsLetterUpdateManager() {
    const navigate = useNavigate();

    function handleCreate() {
        navigate("/manager/newsletterUpdate/create")
        window.scrollTo(0, 0);
    };

    return (
        <section className="min-h-full flex flex-col items-center">
            <h2  className="text-3xl leading-[68px] 
            lg:max-w-md font-montserrat  font-bold p-2 text-center">
                Newsletter
            </h2>
            <div className="flex flex-wrap justify-center items-center rounded-lg 
            bg-white shadow-xl p-5
            ring-slate-900/5">
                <div className="flex flex-col justify-center items-center
                bg-white p-5">
                    <button className="text-white px-4 py-2 text-sm
                    font-montserrat font-medium my-3 mx-1 w-full
                    bg-purple-600 rounded-md hover:shadow-md border-2 border-black"
                    onClick={handleCreate}> 
                        Create
                    </button>
                </div>
            </div>
        </section>
    )  
};


const CreateNewsletterUpdate = () => {
    const [title, setTitle] = useState("");
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [actionMessage, setActionMessage] = useState("Send");
    const [isDisabled, setIsDisabled] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({title, feedback});

    setActionMessage("Processing...")
    setIsDisabled(true);
    
    try {
        const response = await axios.post("http://localhost:4001/newsletter/update", {title, message: feedback});
        const {message, color} = response.data;
        setMessage(message);
        setMessageColor(color);
        setTitle("");
        setFeedback("");
        setActionMessage("Send")
        setIsDisabled(false);   
        setTimeout(() => {
            setMessage("");
        }, 5000);     
    } catch (error) {
        setMessage("Error uploading newsletter");
        setMessageColor("red");
        setTitle("");
        setFeedback("");
        setActionMessage("Send")
        setIsDisabled(false);
        console.error(error);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }        
};


    return (
        <div className="min-h-full flex flex-wrap justify-center items-center mx-20 rounded-lg 
        bg-white px-6">
                <div className="flex flex-col justify-center items-center mb-5"> 
                    <h2 className="text-3xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold p-2">
                        Create Newsletter
                    </h2>
                    {message && <p className="font-montserrat text-sm 
                    leading-8 my-2"
                    style={{ color:`${messageColor}`}}>
                        {message}
                    </p>}
                    <form  className="flex flex-col justify-center items-center mx-5 mb-5 rounded-lg 
                    bg-white px-6 py-4 shadow-xl
                    ring-slate-900/5"
                    onSubmit={handleSubmit}> 
                        <Input
                        type="text"
                        value={title}
                        handleChange={setTitle}
                        resetMessage={setMessage}
                        placeholder="Title"/>
                        <TextArea type="text"
                        value={feedback}
                        resetMessage={setMessage}
                        setValue={setFeedback}
                        placeholder="Message"/>                 
                        <button className="gap-2 px-7 py-4 my-2 border 
                        font-montserrat text-lg leading-none bg-black
                        rounded-full text-white border-black mb-5"
                        type="submit"
                        disabled={isDisabled}>
                            {actionMessage}
                        </button>
                    </form>
                </div> 
        </div>
    );
}

export default NewsLetterUpdateManager;
export {CreateNewsletterUpdate}