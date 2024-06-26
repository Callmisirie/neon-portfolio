import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";
import {arrowRight} from "../assets/icons";

import axios from "axios"
import Button from "../components/Button";

import { NeonWorldArt } from "../assets/images/index.js";
import ReviewSection from "../components/ReviewSection.jsx";



function Home() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();


    function handleClick() {
        navigate("/commission");
        window.scrollTo(0, 0);
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://app.callmineon.com/newsletter", {email});
            console.log(response);
            setEmail("");
        } catch (error) {
            console.error(error)
        }
    }
        

    return (
        <div className="min-h-full">
            <section className="xl:padding-l 
            wide:padding-r">
                <section className="w-full flex 
                xl:flex-row flex-col justify-center 
                gap-10 max-container">
                    <div className="relative 
                    xl:w-2/5 flex flex-col 
                     items-start mt-28 max-xl:mt-14
                    w-full max-xl:padding-x"> 
                            <p className="text-xl 
                            font-montserrat mb-5
                            text-purple-600">
                                Create your world.
                            </p>
                            <h1 className="mt-10 max-xl:mt-5
                            font-palanquin text-8xl 
                            max-sm:text-4xl 
                            font-bold">
                                <span className="lg:bg-white 
                                xl:whitespace-nowrap 
                                relative z-20 pr-10">
                                    Stories Untold,
                                </span> 
                                <br />
                                <span className="text-purple-600 
                                inline-block mt-3">
                                    Gods
                                </span> Unfold
                            </h1>  
                            <p className="font-montserrat 
                            text-slate-gray text-lg max-w-lg
                            leading-8 mt-6 mb-14">
                                It is your duty, if not your right, to inspire others just as you were inspired.
                            </p>
                            <Button label="Preview price" 
                            iconURL={arrowRight}
                            handleClick={handleClick}/>
                    </div>
                    <div className="relative max-xl:hidden
                      mt-28 max-xl:mt-14">
                        <img className="object-contain 
                        rounded-xl border-2 border-purple-600
                        relative z-10 w-fit"
                        src={NeonWorldArt}
                        alt="Art" />                        
                    </div>
                </section>
            </section>
            <section className="padding bg-purple-50">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col 
                    justify-center items-center  rounded-3xl 
                    shadow-3xl ring-slate-900/5">
                        <button >
                            <video className="rounded-3xl" src="/videos/NeonArt.mp4" width={500} controls muted loop>
                            </video>
                        </button>
                        
                    </div>
                </div>
            </section>
           <ReviewSection />
            <section className="padding-x 
            sm:py-32 py-16 w-full">
                <section className="max-container
                flex justify-between items-center 
                max-lg:flex-col gap-10">
                    <h3 className="text-4xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold">
                        Sign Up for
                        <span className="text-purple-600"> Updates
                        </span> & Newsletter

                    </h3>
                    <form    
                        onSubmit={handleSubmit}
                        className="lg:max-w-[40%] 
                        w-full flex items-center 
                        max-sm:flex-col gap-5 p-2.5
                        sm:border sm:border-slate-gray 
                        rounded-full">
                            <input className="input"
                            onChange={(e)=> setEmail(e.target.value)} 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            name="email"/>
                            <div className="flex 
                            max-sm:justify-end items-center
                            max-sm:w-full">
                                <Button label="Sign Up" fullwidth/>
                            </div>
                    </form>
                </section>  
            </section>
        </div>  
    );
};


export default Home;