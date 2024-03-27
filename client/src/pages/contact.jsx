import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";


function Contact() {
    return (
        <section className=""
        >
            <section className="min-h-screen"
            >
             <Navbar />
                <div className="min-h-full flex flex-col justify-center items-center  max-container">
                    <div className="mt-5">
                        <h1 className="my-2.5 
                                font-palanquin text-4xl  
                                font-bold"> Contact us for more</h1>

                    </div>
                    <div className="my-5">
                        <input 
                            placeholder="Info"
                        />
                        <button>Click me</button>
                    </div>
                </div>
                
            </section>
            <Footer />
        </section>
    );
};


export default Contact;