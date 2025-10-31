import { useState } from "react";
//import { addRecipe } from "../recipeBackend"
import './RecipeForm.css'
import { FaMinus, FaPlus } from "react-icons/fa";

export const RecipeForm=()=>{
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  // Új sor hozzáadása
  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipe = {
      name,
      ingredients: ingredients.split(",").map(i => i.trim()),
      steps,
      category
    };
   // await addRecipe(recipe, file);
    setName(""); setIngredients(""); setSteps(""); setCategory(""); setFile(null);
  };

  return (
    <div className="recipeForm">
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recept neve" required/>
      <div className="ingredients">
       
          {ingredients.map((ing, idx) => (
            <div className="ingredient">
            <FaMinus className="removeIngredient" onClick={addIngredientField}/>
            <input 
                key={idx}
                value={ing}
                onChange={(e) => handleIngredientChange(idx, e.target.value)}
                placeholder={`Hozzávaló ${idx + 1}`}
                />
           
            </div>
            ))} 
         <FaPlus className="addIngredient" onClick={addIngredientField}/>
      </div>
     
      <textarea value={steps} onChange={e=>setSteps(e.target.value)} placeholder="Elkészítés lépései" required/>
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Kategória" />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/>
      <button type="submit">Mentés</button>
    </form>
    </div>
  );
}
