import React from 'react'
import { useNavigate } from 'react-router'
import { FaHome } from "react-icons/fa";

export const Recipes = () => {
    const navigate=useNavigate()
  return (
    <div className='recipes'>
       default Recipes
       <FaHome size={18} onClick={()=>navigate('/')} className='goHome'/>
        <button onClick={()=>navigate('/addnew')} className="add">új recept hozzáadása</button>
    </div>
  )
}

