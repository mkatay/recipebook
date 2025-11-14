import React from 'react'
import './Recipe.css'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { deleteRecipe } from '../recipeBackend'
import { useState } from 'react'
import { useContext } from 'react'
import { MyUserContext } from '../context/MyUserContext'

export const Recipe = ({id, name, ingredients, steps, category, imageUrl,deleteUrl,uid,displayName }) => {
  const {user,setMsg}=useContext(MyUserContext)
  const navigate=useNavigate()
  const handleDelete=()=>{
    deleteRecipe(id,deleteUrl,setMsg)
  }

  const formattedText = steps.split('\n')

  return (
    <div className="recipe-card">
      <img src={imageUrl} alt={name} className="recipe-img" />
      <div className="recipe-content">
        <h2>{name} <span style={{fontSize:'0.8rem',fontStyle:'italic'}}>({displayName})</span></h2>
        <p className="category">Kategória: {category}</p>
        <div className="recipe-detail">
            <h4>Hozzávalók:</h4>
            <ul>
              {ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Elkészítés:</h4>
            {formattedText.map((line, i) => (
              <p className="steps" key={i}>{line}</p>
            ))
          }
        </div>
      {user &&  uid==user.uid && 
        <div className="actions">
          <button className="edit-btn" onClick={()=>navigate('/edit/'+id)} style={{backgroundColor:"var(--color-bg)"}}>
            <MdEdit size={24} style={{color:"blue"}}/>
          </button>
          <button className="delete-btn" onClick={handleDelete} >
            <MdDelete size={24} style={{color:"red"}}/> 
          </button>
        </div>
      }
     </div>
    </div>
  )
}


