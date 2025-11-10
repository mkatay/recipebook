import React from 'react'
import './Recipe.css'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { deleteRecipe } from '../recipeBackend'
import { useState } from 'react'

export const Recipe = ({id, name, ingredients, steps, category, imageUrl,deleteUrl }) => {
  const [serverMsg,setServerMsg]=useState(null)
  const navigate=useNavigate()
  const handleDelete=()=>{
    deleteRecipe(id,deleteUrl,setServerMsg)
  }

  const formattedText = steps.split('\n')

  return (
    <div className="recipe-card">
      <img src={imageUrl} alt={name} className="recipe-img" />
      <div className="recipe-content">
        <h2>{name}</h2>
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
        <div className="actions">
          <button className="edit-btn" onClick={()=>navigate('/edit/'+id)} style={{backgroundColor:"var(--color-bg)"}}>
            <MdEdit size={24} style={{color:"blue"}}/>
          </button>
          <button className="delete-btn" onClick={handleDelete} >
            <MdDelete size={24} style={{color:"red"}}/> 
          </button>
        </div>
        {serverMsg && <div>{serverMsg?.msg}</div>}
      </div>
    </div>
  )
}


