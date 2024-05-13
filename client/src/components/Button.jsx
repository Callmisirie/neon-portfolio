const Button = ({label, iconURL, backgroundColor, textColor, borderColor, fullwidth, handleClick}) => {
  return (
    <button className={`flex justify-center 
      items-center gap-2 px-7 py-4 border 
      font-montserrat text-lg leading-none hover:shadow-md
      ${backgroundColor ? `${backgroundColor} 
      ${textColor} ${borderColor}`  
      : "bg-purple-600 text-black border-black border-2 "}
      rounded-full ${fullwidth && `w-full`}`}
      type="submit"
      onClick={handleClick}
    >
        {label}
        {iconURL && 
          <img 
            src={iconURL}
            alt="arrow right icon"
            className="ml-2 rounded-full w-5 h-5"
        /> 
        }
    </button>
  )
}
export default Button 