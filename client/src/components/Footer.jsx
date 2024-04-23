import React, { useState, useEffect } from "react";
import axios from "axios";
import { copyrightSign } from "../assets/icons";
import { footerLogowhite } from "../assets/images";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => {
  const [commissions, setCommissions] = useState([]);
  const [commissionID, setCommissionID] = useState(null)

  useEffect(() => {
      const fetchCommission = async () =>{
          try {
              const response = await axios.get("http://localhost:4001/manager/commission/read") 
              setCommissions(response.data)
          } catch (error) {
             console.error(error);
          }
      }
      fetchCommission();
  }, []);

  return (
    <section className="bg-black padding-x padding-t pb-8">
      <footer className="max-container">
          <div className="flex 
            justify-between items-start gap-20
            flex-wrap max-lg:flex-col"
          >
           <div className="flex flex-col items-start">
            <a>
              <img 
                src={footerLogowhite}
                width={70}
                height={33}
              />
            </a>
            <p className="mt-6 text-base 
              leading-7 font-montserrat
              text-white-400 sm:max-w-sm"
            >
              When riches begin to come, they come in such great 
              abundance that one often wonders where they have been 
              hiding during all those lean years.
            </p>
            <div className="flex items-center gap-5 mt-8">
              {socialMedia.map((icon)=>(
                <div className="flex justify-center 
                  items-center w-12 h-12 bg-white
                  rounded-full"
                  key={icon.src}
                >
                  <img 
                    src={icon.src}
                    alt={icon.alt}
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>
           </div>

           <div className="flex flex-1
              justify-between lg:gap gap-20 
              flex-wrap"
            >
            {footerLinks.map((section)=> (
              <div key={section.title}>
                <h4 className="text-white font-montserrat 
                  text-2xl leading-normal font-medium mb-6 "
                >
                  {section.title}
                </h4>
                  <ul>
                    {section.links.map((link) => (
                      <li className="mt-3
                        text-white-400 font-montserrat
                        text-base leading-normal 
                        hover:text-slate-gray 
                        cursor-pointer"
                        key={link.name}
                    >
                        <a>{link.name}</a>
                      </li>
                    ))}
                  </ul>
              </div>
            ))}
           </div>
          </div>
          <div className="flex justify-between 
            text-white-400 mt-24 max-sm:flex-col
            max-sm:items-center"
          >
            <div className="flex flex-1 
              justify-start items-center gap-2
              font-montserrat cursor-pointer"
            >
              <img 
                src={copyrightSign}
                alt="copy right sign"
                width={20}
                height={20}
                className="rounded-full m-0"
              />
              <p>Copyright. All right reserved.</p>
            </div>
            <p className="font-montserrat cursor-pointer">
              Term & Conditions  
            </p>
          </div>
      </footer>
    </section>
    

  ) 
}

export default Footer;