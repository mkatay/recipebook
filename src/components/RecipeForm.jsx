import { useState } from "react";
import './RecipeForm.css'
import { FaMinus, FaPlus } from "react-icons/fa";
import { addRecipe, readRecipeById, updateRecipe } from "../recipeBackend";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export const RecipeForm=()=>{
   const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  //ha edit van:
  const [recipe,setRecipe]=useState(null)
  const {id}=useParams()
  const navigate=useNavigate()

  useEffect(() => {
  if (id) {
    readRecipeById(id, setRecipe);
  }
}, [id]);

// 💡 Ez külön figyeli a recipe-t, és csak akkor fut le, ha az már megérkezett
useEffect(() => {
  if (recipe) {
    console.log("Adatok betöltve:", recipe);
    setName(recipe.name || "");
    setIngredients(recipe.ingredients || [""]);
    setSteps(recipe.steps || "");
    setCategory(recipe.category || "");
    setPreview(recipe.imageUrl || null);
  }
}, [recipe]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };


  // Új sor hozzáadása
  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    let inputData= {
      name,
      ingredients,
      steps,
      category
    };
     if (id) {
    // 🔄 Szerkesztés
    await updateRecipe(id,!file ? {...inputData,imageUrl:recipe.imageUrl,deleteUrl:recipe.deleteUrl}: inputData, file,recipe.deleteUrl);
  } else {
    // 🆕 Új recept
    await addRecipe(inputData, file);
  }
    console.log("recept mentve:",recipe);
    
    setName(""); setIngredients([""]); setSteps(""); setCategory(""); setFile(null);
    setLoading(false)
    navigate('/recipes')
  };

   const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };


  return (
    <div className="recipeForm">
      <h2>Új recept feltöltése</h2>
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recept neve" required/>
      <div className="ingredients">
       
          {ingredients.map((ing, idx) => (
            <div   key={idx} className="ingredient">
            <FaMinus className="removeIngredient" onClick={addIngredientField}/>
            <input 
                value={ing}
                onChange={(e) => handleIngredientChange(idx, e.target.value)}
                placeholder={`Hozzávaló ${idx + 1}`}
                />
           
            </div>
            ))} 
         <FaPlus className="addIngredient" onClick={addIngredientField}/>
      </div>
     
      <textarea value={steps} onChange={e=>setSteps(e.target.value)} placeholder="Elkészítés lépései" required
         style={{ whiteSpace: 'pre-wrap',height:'200px' }} />
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Kategória" />
      <input type="file" accept="image/*" onChange={handleFileChange}/>
       {preview && (
        <img
          src={preview}
          alt="Előnézet"
          style={{
            width: "100%",
            maxHeight: "200px",
            objectFit: "cover",
            borderRadius: "0.5rem",
            marginTop: "0.5rem",
          }}
        />
      )}
      <button type="submit" disabled={loading || !name || !category || !steps || (!file &&!preview) || ingredients.length<=1}>
       {loading ? "Mentés...": id  ? "Recept frissítése" : "Új recept mentése"}
      </button>
    </form>
    <MdCancel className="cancel" size={30} onClick={()=>navigate('/recipes')}/> 
    </div>
  );
}
