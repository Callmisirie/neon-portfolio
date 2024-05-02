import React from 'react'

const Input = ({type, value, placeholder, handleChange, resetMessage}) => {
  return (
    <input className="gap-5 p-2.5 my-2
    border border-slate-gray max-w-fit
    rounded-full text-center font-montserrat"
    type={type} 
    value={value} 
    onChange={(e) => {
        handleChange(e.target.value)
        resetMessage("")
    }} 
    placeholder={placeholder}/> 
  )
}

export default Input