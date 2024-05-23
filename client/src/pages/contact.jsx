import { email, worldwide } from "../assets/icons";
import { socialMedia } from "../constants";


function Contact() {

    return (
        <section className="min-h-full">
            <div className=" flex flex-wrap justify-center items-center">
                <div className="flex flex-col justify-center items-center rounded-lg 
                bg-white py-5 px-10 shadow-xl mb-10
                ring-slate-900/5">
                    <h1 className="text-4xl leading-[68px] 
                    lg:max-w-md font-palanquin font-bold p-2 text-center">
                            Contact us
                    </h1>
                    <div className="flex 
                    flex-col justify-center items-center 
                    max-w-xs py-5 px-10 bg-slate-gray/5 
                    rounded-xl my-5">
                        <h3 className="text-xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            Email
                        </h3>
                        <p className="font-montserrat 
                        text-slate-gray max-w-xs text-start
                        text-xs">
                            Do you need to contact us? You can contact us via our email address 
                        </p>
                    <a className=" flex justify-center font-semibold hover:shadow-md
                    items-center px-4 gap-2 py-2 mt-5 border text-white w-full
                    font-montserrat text-sm bg-purple-500 border-purple-500 rounded-md"
                    href="mailto:neonworld@gmail.com">
                        <img 
                        src={email}
                        alt={email}
                        width={24}
                        height={24} />
                        <button >
                            info@callmineon.com                         
                        </button>
                    </a>    
                    </div>
                    <div className="flex 
                    flex-col justify-center items-center 
                    max-w-xs py-5 px-10 bg-slate-gray/5 
                    rounded-xl my-5">
                        <div className="flex justify-center items-center">
                            <img 
                            src={worldwide}
                            alt={worldwide}
                            width={24}
                            height={24} />
                            <h3 className="text-xl 
                            lg:max-w-md font-palanquin 
                            font-bold p-2 text-center">
                                Our Socials
                            </h3>                            
                        </div>

                        <p className="font-montserrat 
                        text-slate-gray max-w-xs text-start
                        text-xs">
                            Reach out or follow up our socials to stay up to date on the latest news about CallmiNeon. 
                        </p>
                        <div className="flex items-center gap-5 mt-5">
                        {socialMedia.map((icon)=>(
                            <a href={icon.link} target="_blank" rel="noopener noreferrer"
                            key={icon.src}>
                            <div className="flex justify-center
                                items-center w-12 h-12 bg-white
                                rounded-full cursor-pointer"
                                key={icon.src}
                            >
                                <img 
                                src={icon.src}
                                alt={icon.alt}
                                width={24}
                                height={24}
                                />
                            </div>
                            </a>
                        ))}
                        </div>                       
                    </div>
                </div>
                
            </div>
        </section>
    );
};


export default Contact;