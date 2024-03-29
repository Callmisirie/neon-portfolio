import {useState} from "react"
import axios from "axios"
import Button from "../components/Button";
import { arrowRight } from "../assets/icons";
import {bigShoe1} from "../assets/images"

import {shoes, statistics} from "../constants"
import ShoeCard from "../components/ShoeCard.jsx";

function Home() {
    const [email, setEmail] = useState("");
    const [bigShoeImg, setBigShoeImg] = useState(bigShoe1)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4001/updateSignUp", {email});
            console.log(response);
            setEmail("");
        } catch (error) {
            console.error(error)
        }
    }
            
           

    return (
        <div>
            <section className="xl:padding-l wide:padding-r padding-b">
                <section className="w-full flex 
                    xl:flex-row flex-col justify-center 
                    min-h-screen gap-10 max-container"
                >
                    <div className="relative 
                        xl:w-2/5 flex flex-col 
                        justify-center items-start 
                        w-full max-xl:padding-x pt-28"
                    > 
                            <p className="text-xl 
                                font-montserrat 
                                text-purple-600"
                            >
                                The pressure applied.
                            </p>
                            <h1 className="mt-10 
                                font-palanquin text-8xl 
                                max-sm:text-[72px] 
                                font-bold"
                            >
                                <span className="xl:bg-white 
                                    xl:whitespace-nowrap 
                                    relative z-10 pr-10"
                                >
                                    Stories Untold,
                                </span> 
                                <br />
                                <span className="text-purple-600 
                                    inline-block mt-3"
                                >
                                    Gods
                                </span> Unfold
                            </h1>  
                            <p className="font-montserrat 
                                text-slate-gray text-lg 
                                leading-8 mt-6 mb-14"
                            >
                                A man who lives fully is prepared to die at anytime.
                            </p>
                            <Button label="Commission now" 
                                iconURL={arrowRight}
                            />
                            <div className="flex 
                                justify-starts items-start 
                                flex-wrap w-full mt-30 gap-16"
                            >
                               {statistics.map((stat)=> (
                                <div key={stat.label}>
                                    <p className="text-4xl
                                        font-palanquin font-bold"
                                    >
                                        {stat.value}
                                    </p>
                                    <p className="leading-7
                                        font-montserrat 
                                        text-slate-gray"
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                               ))} 
                            </div>
                    </div>
                    <div className="relative 
                        flex-1 flex justify-center 
                        items-center xl:min-h-screen 
                        max-xl:py-40 bg-primary
                        bg-hero bg-cover bg-center"
                    >
                        <img 
                            src={bigShoeImg}
                            alt="Shoe Image"
                            width={610}
                            height={500}
                            className="object-contain 
                                relative z-10"
                        />
                        <div className="flex sm:gap-6 
                            gap-4 absolute -bottom-[5%]
                            sm:left-[10%] max-sm:px-6"
                        >
                            {shoes.map((shoe)=> 
                                <div key={shoe}>    
                                    <ShoeCard 
                                        imgURL={shoe}
                                        changeBigShoeImage={(shoe)=> setBigShoeImg(shoe)}
                                        bigShoeImg={bigShoeImg}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </section>
            <section className="padding">
                <h1 className="mt-10     
                                font-palanquin text-8xl 
                                max-sm:text-[72px] 
                                font-bold flex justify-center"
                >
                    Special Offer
                </h1>
            </section>
            <section className="padding-x sm:py-32 py-16 w-full">
                <section className="max-container
                    flex justify-between items-center 
                    max-lg:flex-col gap-10"
                >
                    <h3 className="text-4xl leading-[68px] 
                        lg:max-w-md font-palanquin font-bold"
                    >Sign Up for
                        <span className="text-purple-600"> Updates
                        </span> & Newsletter

                    </h3>
                    
                    <form    
                        onSubmit={handleSubmit}
                        className="lg:max-w-[40%] 
                            w-full flex items-center 
                            max-sm:flex-col gap-5 p-2.5
                            sm:border sm:border-slate-gray 
                            rounded-full"
                        >
                            <input  
                                className="input"
                                onChange={(e)=> setEmail(e.target.value)} 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                name="email"
                            />
                            <div className="flex 
                                max-sm:justify-end items-center
                                max-sm:w-full"
                            >
                                <Button label="Sign Up" fullwidth/>
                            </div>
                    </form>
                </section>
               
            </section>
        </div>  
    );
};


export default Home;