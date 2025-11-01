import React from 'react'
import { useNavigate } from 'react-router'

export const Home = () => {
    const navigate=useNavigate()
  return (
    <div className='app'>
      <header>
        <h1>RecipeBook</h1>
        <button   onClick={()=>navigate('/recipes')} className="motto">Főzz, posztolj, inspirálj !</button>     
      </header>   
    </div>
  )
}

