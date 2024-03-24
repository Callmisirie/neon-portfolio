import {useState} from "react"
import axios from "axios"
import Button from "../components/Button";
import { arrowRight } from "../assets/icons";

function Home() {
    const [email, setEmail] = useState("");


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
            <section className="xl:padding wide:padding-r padding-b">
                <section className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container">
                    <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:padding-x pt-28"> 
                            <p className="text-xl 
                                font-montserrat 
                                text-coral-red"
                            >
                                Neon World
                            </p>
                            <h1 className="mt-10 
                                font-palanquin text-8xl 
                                max-sm:text-[72px] 
                                max-sm:leading-[82]
                                font-bold"
                            >
                                <span className="xl:bg-white 
                                    xl:whitespace-nowrap 
                                    relative z-10 pr-10"
                                >
                                    Stories Untold,
                                </span> 
                                <br />
                                <span className="text-coral-red 
                                    inline-block mt-3"
                                >
                                    God
                                </span> Unfold
                            </h1>  
                            <p className="font-montserrat 
                                text-slate-gray lext-lg 
                                leading-8 mt-6 mb-14"
                            >
                                A man who lives fully is prepared to die at anytime.
                            </p>
                            <Button label="Commission now" 
                                iconURL={arrowRight}
                            />
                    </div>
                </section>
            </section>
            <section className="padding">
                
                <h1 className="mt-10 
                                font-palanquin text-8xl 
                                max-sm:text-[72px] 
                                max-sm:leading-[82]
                                font-bold"
                >
                    Special Offer
                </h1>
            </section>
            <section className="padding-x sm:py-32 py-16 w-full">
                <form    
                    onSubmit={handleSubmit}
                >
                    <input 
                        onChange={(e)=> setEmail(e.target.value)} 
                        type="email" 
                        placeholder="Email"c
                        value={email}
                        name="email"
                    />
                    <button type="submit">Submit</button>
                </form>
            </section>
        </div>  
    );
};


export default Home;