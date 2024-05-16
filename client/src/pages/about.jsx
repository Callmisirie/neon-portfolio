function About() {
    return (
        <section className="min-h-full">
            <div className=" flex 
            justify-center h-svh
             bg-black">
                <div className="flex flex-col 
                justify-evenly items-center 
                bg-white py-5 px-10">
                    <div className="flex 
                    flex-col justify-center items-center 
                    max-w-lg p-5  
                    rounded-xl">
                        <h3 className="text-3xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            About NeonWorld
                        </h3>
                        <p className="font-montserrat 
                        text-slate-gray max-w-xs text-start
                        text-xs">
                            Welcome to NeonWorld, your gateway to a world of vibrant and captivating art! 
                            NeonWorld is more than just a platform; it's a creative journey where art lovers and creators converge to explore, 
                            appreciate, and commission stunning artwork.
                        </p>
                    </div>
                    <div className="flex 
                    flex-col justify-center items-center 
                    max-w-lg p-5  
                    rounded-xl">
                        <h3 className="text-xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            Commissioning Artwork
                        </h3>
                        <p className="font-montserrat 
                        text-slate-gray max-w-xs text-start
                        text-xs">
                            One of the unique features of NeonWorld is our commissioning service.  
                            Our artists are here to bring your vision to life. Our easy-to-use commissioning process allows you to collaborate directly with artists, 
                            ensuring that the final piece is tailored to your specifications.
                        </p>
                    </div>
                    <div className="flex 
                    flex-col justify-center items-center 
                    max-w-lg p-5 
                    rounded-xl">
                        <h3 className="text-xl 
                        lg:max-w-md font-palanquin 
                        font-bold p-2 text-center">
                            Get Started
                        </h3>
                        <p className="font-montserrat 
                        text-slate-gray max-w-xs text-start
                        text-xs">
                            Whether you're an artist looking to showcase your work or an art enthusiast seeking the perfect piece, 
                            NeonWorld is here for you. Join our community today and experience the magic of art like never before.
                        </p>
                    </div>
                </div>
            </div>
            
        </section>
        
    );
};


export default About;