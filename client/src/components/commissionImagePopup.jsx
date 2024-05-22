import { hamburgerCancel } from "../assets/icons"


function CommissionImagePopup({open, onClose, commission}) {
  return (
    <div onClick={onClose} className={`
    fixed inset-0 flex justify-center items-center transition-colors z-20 cursor-pointer
    ${open ? " backdrop-filter backdrop-blur-sm" : "invisible"}`}>
        <div className={`bg-white p-6 
        transition-all rounded-3xl  
        shadow-xl cursor-default
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0" }`}
        onClick={e => e.stopPropagation() }>
            <img className={`flex 
            flex-col justify-center rounded-xl 
            m-2`}
            src={`https://app.callmineon.com/display/${commission._id}`} 
            alt={`Manga ${commission.artImage}`} 
            style={{ width: "330px" }} 
            />
            <button className="absolute top-2 right-2 p-1 rounded-lg
            text-gray-400 bg-white hover:bg-gray-50
            hover:text-gray-600">
                <img className="cursor-pointer" 
                src={hamburgerCancel}
                alt="Hamburger"
                width={20}
                height={20}
                onClick={onClose}
                />
            </button>            
        </div>
    </div>
  )
}

export default CommissionImagePopup