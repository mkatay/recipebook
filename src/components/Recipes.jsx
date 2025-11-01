import React from 'react'
import { useNavigate } from 'react-router'
import { FaHome } from "react-icons/fa";
import { useState } from 'react';
import { useEffect } from 'react';
import { readRecipes } from '../recipeBackend';
import { Recipe } from './Recipe';

export const Recipes = () => {
  const [recipes,setRecipes]=useState([])
  useEffect(()=>{
    readRecipes(setRecipes)
  },[])
  const navigate=useNavigate()
  return (
    <div className='recipes'>
       {recipes && recipes.length>0 &&  recipes.map(obj=><Recipe key={obj.id} {...obj}/>)}
       <FaHome size={18} onClick={()=>navigate('/')} className='goHome'/>
        <button onClick={()=>navigate('/addnew')} className="add">új recept hozzáadása</button>
    </div>
  )
}

