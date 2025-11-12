import React from 'react'
import { useNavigate } from 'react-router'
import { FaHome } from "react-icons/fa";
import { useState } from 'react';
import { useEffect } from 'react';
import { readRecipes } from '../recipeBackend';
import { Recipe } from './Recipe';
import { useContext } from 'react';
import { MyUserContext } from '../context/MyUserContext';

export const Recipes = () => {
  const {user}=useContext(MyUserContext)
  const [recipes,setRecipes]=useState(null)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    setLoading(true)
    readRecipes(setRecipes,setLoading)
  },[])
  const navigate=useNavigate()

  console.log(user);
  
  return (
    <div className='recipes'>
      {loading && <p>Loading....</p>}
      {recipes && recipes.length>0 &&  recipes.map(obj=><Recipe key={obj.id} {...obj}/>)}
      {recipes && recipes.length==0 && <h4>Nincsenek feltöltött receptek!</h4>}
      <button onClick={()=>navigate('/addnew')} className="add">új recept hozzáadása</button>
    </div>
  )
}

