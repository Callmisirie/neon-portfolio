const TextArea = ({type, value, resetMessage, setValue, placeholder}) => {
  return (
    <div className="flex flex-col justify-center items-center 
    rounded-lg w-full my-2">
        <textarea className="gap-5 p-2.5
        border border-slate-gray text-sm w-full
        rounded-md text-center font-montserrat"
        type={type} 
        value={value.length <= 100 ? value :
        value.slice(0, 100)} 
        onChange={(e) => {
            resetMessage("");
            if (e.target.value.length <= 100) {
                setValue(e.target.value);
            }
        }}
        placeholder={placeholder}/>
         <p className="font-montserrat text-xs
        leading-8">
            Max char - 100/{value.length}
        </p>
    </div>
   
  )
}

export default TextArea